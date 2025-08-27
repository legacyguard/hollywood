import { Icon } from '@/components/ui/icon-library';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FadeIn } from '@/components/motion/FadeIn';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { PathOfSerenity } from '@/components/dashboard/PathOfSerenity';
import { AttentionSection } from '@/components/dashboard/AttentionSection';
import { LegacyOverviewSection } from '@/components/dashboard/LegacyOverviewSection';
import { useEncryptionReady } from '@/hooks/encryption/useEncryption';
import { EncryptionSetup } from '@/components/encryption/EncryptionSetup';
import { MetricsGrid } from '@/components/enhanced/MetricCard';
import {
  ActivityFeed,
  useMockActivities,
} from '@/components/enhanced/ActivityFeed';
import { RadialProgress } from '@/components/enhanced/RadialProgress';
import { GardenSeed } from '@/components/animations/GardenSeed';
import { useGardenProgress } from '@/hooks/useGardenProgress';
import { TrustScoreDisplay } from '@/components/trust/TrustScoreDisplay';
import { calculateUserTrustScore } from '@/lib/trust-score/trust-score-calculator';
import { useState } from 'react';

export function DashboardContent() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { needsSetup, isLoading } = useEncryptionReady();
  const mockActivities = useMockActivities();
  const { progress: gardenProgress, loading: gardenLoading } =
    useGardenProgress();

  // Mock user stats for trust score calculation
  const mockUserStats = {
    documents: Array(5).fill({}), // 5 documents uploaded
    professional_reviews: [], // No professional reviews yet
    emergency_contacts: Array(1).fill({}), // 1 emergency contact
    guardians: [], // No guardians assigned
    will_completed: false, // Will not completed
    encryption_enabled: true, // Encryption enabled
    two_factor_enabled: false, // 2FA not enabled
    family_members: Array(2).fill({}), // 2 family members
    shared_documents: Array(3).fill({}), // 3 documents shared
    last_activity_days: 2, // Active 2 days ago
    account_age_days: 45, // Account is 45 days old
    legal_compliance_score: 0, // No legal compliance score yet
  };

  const trustScore = calculateUserTrustScore(mockUserStats);

  // Mock metrics data - in production, this would come from your API
  const [metrics] = useState([
    {
      title: 'Documents Protected',
      value: '24',
      change: 12,
      trend: 'up' as const,
      icon: 'file-text',
      color: 'primary' as const,
      onClick: () => navigate('/vault'),
    },
    {
      title: 'Family Members',
      value: '8',
      change: 2,
      trend: 'up' as const,
      icon: 'users',
      color: 'success' as const,
      onClick: () => navigate('/family'),
    },
    {
      title: 'Guardians',
      value: '3',
      changeLabel: 'Active',
      icon: 'shield',
      color: 'warning' as const,
      onClick: () => navigate('/guardians'),
    },
    {
      title: 'Days Protected',
      value: '147',
      icon: 'calendar',
      color: 'info' as const,
    },
  ]);

  // Show encryption setup if needed
  if (!isLoading && needsSetup) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-6'>
        <EncryptionSetup />
      </div>
    );
  }

  const handleNewInformation = () => {
    navigate('/vault');
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header - Family Shield Dashboard */}
      <header className='bg-card border-b border-card-border'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
              <SidebarTrigger className='lg:hidden' />
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <h1 className='text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3'>
                    Family Shield{user?.firstName ? `, ${user.firstName}` : ''}
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p className='text-lg leading-relaxed max-w-2xl text-muted-foreground'>
                    Overview of everything protecting your family
                  </p>
                </FadeIn>
              </div>
            </div>
            <FadeIn duration={0.5} delay={0.6}>
              <Button
                onClick={handleNewInformation}
                className='bg-primary hover:bg-primary-hover text-primary-foreground shadow-md'
                size='lg'
              >
                <Icon name='add' className='w-5 h-5 mr-2' />
                Secure New Information
              </Button>
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16'>
        {/* Analytics Metrics */}
        <section>
          <FadeIn duration={0.5} delay={0.8}>
            <h2 className='text-xl font-semibold mb-6 text-card-foreground'>
              Your Legacy at a Glance
            </h2>
            <MetricsGrid metrics={metrics} columns={4} />
          </FadeIn>
        </section>

        {/* Main Dashboard Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Path & Overview */}
          <div className='lg:col-span-2 space-y-8'>
            {/* 1. Section: Path of Serenity with Garden Progress */}
            <div>
              <PathOfSerenity className='w-full' />
              <div className='mt-6 flex justify-center'>
                {!gardenLoading && gardenProgress ? (
                  <div className='flex flex-col items-center space-y-4'>
                    <GardenSeed
                      progress={gardenProgress.overallProgress}
                      size='large'
                      showPulse={true}
                      onSeedClick={() => navigate('/legacy')}
                    />
                    <div className='text-center space-y-1'>
                      <p className='text-sm font-medium text-foreground'>
                        Your Garden Progress: {gardenProgress.overallProgress}%
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {gardenProgress.documentsCount} documents •{' '}
                        {gardenProgress.guardiansCount} guardians •{' '}
                        {gardenProgress.completedMilestones} milestones
                      </p>
                    </div>
                  </div>
                ) : (
                  <RadialProgress
                    value={75}
                    label='Loading Garden Progress'
                    size='lg'
                    color='primary'
                  />
                )}
              </div>
            </div>

            {/* 2. Section: Current Challenges (Dynamic action zone) */}
            <AttentionSection />

            {/* 3. Section: Shield Areas Overview (Bundle cards) */}
            <LegacyOverviewSection />
          </div>

          {/* Right Column - Trust Score & Activity Feed */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Trust Score Display */}
            <FadeIn duration={0.5} delay={1.0}>
              <TrustScoreDisplay
                trustScore={trustScore.totalScore}
                showDetails={true}
                showBoosts={true}
                userId={user?.id}
                onImproveClick={() => {
                  // Navigate to improvement suggestions or professional review
                  if (trustScore.nextMilestone?.suggestions.includes('professional')) {
                    navigate('/legacy'); // Will wizard with professional review
                  } else {
                    navigate('/vault'); // Document upload area
                  }
                }}
                className="mb-6"
              />
            </FadeIn>

            {/* Activity Feed */}
            <ActivityFeed
              activities={mockActivities}
              title='Recent Activity'
              maxHeight='500px'
              onViewAll={() => navigate('/activity')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
