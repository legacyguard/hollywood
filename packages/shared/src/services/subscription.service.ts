import { supabase } from '../supabase/client';

export type SubscriptionPlan = 'free' | 'essential' | 'family' | 'premium';
export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'cancelled' | 'trialing';
export type BillingCycle = 'month' | 'year';

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  started_at?: string;
  expires_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  document_count: number;
  storage_used_mb: number;
  time_capsule_count: number;
  scans_this_month: number;
  offline_document_count: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionLimits {
  plan: SubscriptionPlan;
  max_documents: number | null;
  max_storage_mb: number | null;
  max_time_capsules: number | null;
  max_scans_per_month: number | null;
  max_family_members: number;
  offline_access: boolean;
  ai_features: boolean;
  advanced_search: boolean;
  priority_support: boolean;
}

export type UsageType = 'documents' | 'storage' | 'time_capsules' | 'scans';

class SubscriptionService {
  /**
   * Get current user's subscription
   */
  async getCurrentSubscription(): Promise<UserSubscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  }

  /**
   * Get current user's usage statistics
   */
  async getCurrentUsage(): Promise<UserUsage | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching usage:', error);
      return null;
    }

    return data;
  }

  /**
   * Get subscription limits for a specific plan
   */
  async getPlanLimits(plan: SubscriptionPlan): Promise<SubscriptionLimits | null> {
    const { data, error } = await supabase
      .from('subscription_limits')
      .select('*')
      .eq('plan', plan)
      .single();

    if (error) {
      console.error('Error fetching plan limits:', error);
      return null;
    }

    return data;
  }

  /**
   * Get all available subscription plans
   */
  async getAllPlans(): Promise<SubscriptionLimits[]> {
    const { data, error } = await supabase
      .from('subscription_limits')
      .select('*')
      .order('plan');

    if (error) {
      console.error('Error fetching plans:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Check if user can perform an action based on their usage limits
   */
  async checkUsageLimit(usageType: UsageType, increment: number = 1): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('check_usage_limit', {
        p_user_id: user.id,
        p_limit_type: usageType,
        p_increment: increment
      });

    if (error) {
      console.error('Error checking usage limit:', error);
      return false;
    }

    return data || false;
  }

  /**
   * Increment usage counter
   */
  async incrementUsage(usageType: UsageType, amount: number = 1): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('increment_usage', {
        p_user_id: user.id,
        p_usage_type: usageType,
        p_amount: amount
      });

    if (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }

    return data || false;
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(feature: keyof SubscriptionLimits): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    if (!subscription) return false;

    const limits = await this.getPlanLimits(subscription.plan);
    if (!limits) return false;

    return !!limits[feature];
  }

  /**
   * Get usage percentage for a specific metric
   */
  async getUsagePercentage(usageType: UsageType): Promise<number> {
    const [subscription, usage] = await Promise.all([
      this.getCurrentSubscription(),
      this.getCurrentUsage()
    ]);

    if (!subscription || !usage) return 0;

    const limits = await this.getPlanLimits(subscription.plan);
    if (!limits) return 0;

    let current = 0;
    let max = 0;

    switch (usageType) {
      case 'documents':
        current = usage.document_count;
        max = limits.max_documents || Infinity;
        break;
      case 'storage':
        current = usage.storage_used_mb;
        max = limits.max_storage_mb || Infinity;
        break;
      case 'time_capsules':
        current = usage.time_capsule_count;
        max = limits.max_time_capsules || Infinity;
        break;
      case 'scans':
        current = usage.scans_this_month;
        max = limits.max_scans_per_month || Infinity;
        break;
    }

    if (max === Infinity) return 0;
    return Math.min(100, Math.round((current / max) * 100));
  }

  /**
   * Check if user needs to upgrade to access a feature
   */
  async needsUpgrade(requiredPlan: SubscriptionPlan): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    if (!subscription) return true;

    const planHierarchy: Record<SubscriptionPlan, number> = {
      'free': 0,
      'essential': 1,
      'family': 2,
      'premium': 3
    };

    return planHierarchy[subscription.plan] < planHierarchy[requiredPlan];
  }

  /**
   * Format storage size for display
   */
  formatStorageSize(mb: number): string {
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(1)} GB`;
  }

  /**
   * Get days remaining in subscription
   */
  async getDaysRemaining(): Promise<number | null> {
    const subscription = await this.getCurrentSubscription();
    if (!subscription || !subscription.expires_at) return null;

    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  async isExpiringSoon(): Promise<boolean> {
    const daysRemaining = await this.getDaysRemaining();
    return daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
  }
}

export const subscriptionService = new SubscriptionService();
