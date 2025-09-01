/**
 * Stripe Service
 * Handles payment processing via Stripe
 */

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  clientSecret?: string;
}

export class StripeService {
  private static instance: StripeService;
  private apiKey?: string;

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async createCustomer(email: string, name?: string): Promise<StripeCustomer> {
    // Mock implementation
    return {
      id: `cus_${Date.now()}`,
      email,
      name,
      paymentMethods: []
    };
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `pi_${Date.now()}_secret`
    };
  }

  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<PaymentMethod> {
    // Mock implementation
    return {
      id: paymentMethodId,
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true
    };
  }

  async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<{ id: string; status: string }> {
    // Mock implementation
    return {
      id: `sub_${Date.now()}`,
      status: 'active'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    console.log('Subscription canceled:', subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<void> {
    console.log('Subscription updated:', subscriptionId, 'to', newPriceId);
  }

  async getProducts(): Promise<StripeProduct[]> {
    // Mock implementation
    return [
      {
        id: 'prod_free',
        name: 'Free Plan',
        description: 'Basic features',
        priceId: 'price_free',
        price: 0,
        currency: 'usd'
      },
      {
        id: 'prod_premium',
        name: 'Premium Plan',
        description: 'All features unlocked',
        priceId: 'price_premium',
        price: 999,
        currency: 'usd',
        interval: 'month'
      }
    ];
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    // Mock implementation
    return {
      id: paymentIntentId,
      amount: 999,
      currency: 'usd',
      status: 'succeeded'
    };
  }
}

export const stripeService = StripeService.getInstance();
