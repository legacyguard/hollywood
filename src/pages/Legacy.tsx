import { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { EnhancedWillWizard } from '@/components/legacy/EnhancedWillWizard';
import type { WillData } from '@/components/legacy/WillWizard';
import type { WillType } from '@/components/legacy/WillTypeSelector';

export default function LegacyPage() {
  usePageTitle('Legacy Planning');
  useAuth();
  const { user } = useUser();
  const [showWillWizard, setShowWillWizard] = useState(false);

  // Get user's first name from Clerk
  const firstName =
    user?.firstName || user?.fullName?.split(' ')[0] || 'Friend';

  const handleStartWillCreator = () => {
    setShowWillWizard(true);
  };

  const handleWillComplete = (_willData: WillData & { willType: WillType }) => {
    // TODO: Save will to database
    // console.log('Will completed:', willData);
    toast.success(
      'Will created successfully! You can access it from your vault.'
    );
    setShowWillWizard(false);
  };

  const handleCloseWizard = () => {
    setShowWillWizard(false);
  };

  // Show Will Wizard if activated
  if (showWillWizard) {
    return (
      <EnhancedWillWizard
        onClose={handleCloseWizard}
        onComplete={handleWillComplete}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-background'>
        {/* Hero Section */}
        <header className='bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-card-border'>
          <div className='max-w-4xl mx-auto px-6 lg:px-8 py-16 text-center'>
            <FadeIn duration={0.8} delay={0.2}>
              <div className='w-20 h-20 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center'>
                <Icon name={"wishes" as any} className='w-10 h-10 text-primary' />
              </div>
            </FadeIn>

            <FadeIn duration={0.8} delay={0.4}>
              <h1 className='text-4xl lg:text-5xl font-bold font-heading text-card-foreground mb-6'>
                Legacy Planning
              </h1>
            </FadeIn>

            <FadeIn duration={0.8} delay={0.6}>
              <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed'>
                {firstName}, this is the most personal part of your digital
                legacy. Create your will, record final wishes, and leave
                heartfelt messages for those you love most.
              </p>
            </FadeIn>

            <FadeIn duration={0.8} delay={0.8}>
              <Button
                onClick={handleStartWillCreator}
                size='lg'
                className='bg-primary hover:bg-primary-hover text-primary-foreground px-8'
              >
                <Icon name={"documents" as any} className='w-5 h-5 mr-2' />
                Create Your Will Now
              </Button>
            </FadeIn>
          </div>
        </header>

        <main className='max-w-6xl mx-auto px-6 lg:px-8 py-16'>
          {/* What's Coming */}
          <FadeIn duration={0.6} delay={1.0}>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold mb-4'>
                What's Coming to Legacy Planning
              </h2>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                We're crafting tools that honor the profound nature of legacy
                planning with the care it deserves.
              </p>
            </div>
          </FadeIn>

          {/* Feature Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
            <FadeIn duration={0.6} delay={1.2}>
              <Card
                className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group border-2 border-primary/20 bg-primary/5'
                onClick={handleStartWillCreator}
              >
                <div className='w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300'>
                  <Icon name={"documents" as any}
                    className='w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <div className='flex items-center justify-center gap-2 mb-4'>
                  <h3 className='text-xl font-semibold'>
                    Digital Will Creator
                  </h3>
                  <div className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-xs font-medium text-green-700 dark:text-green-300'>
                      Available
                    </span>
                  </div>
                </div>
                <p className='text-muted-foreground leading-relaxed mb-4'>
                  Step-by-step guidance to create a comprehensive will with
                  built-in legal templates and jurisdiction-specific
                  requirements.
                </p>
                <Button className='bg-primary hover:bg-primary-hover text-primary-foreground'>
                  <Icon name={"arrow-right" as any} className='w-4 h-4 mr-2' />
                  Start Creating Your Will
                </Button>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.4}>
              <Card className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group'>
                <div className='w-16 h-16 mx-auto mb-6 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-300'>
                  <Icon name={"video" as any}
                    className='w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Time Capsule Messages
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Record video messages, write letters, and create digital time
                  capsules to be delivered on special occasions or milestones.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.6}>
              <Card className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group'>
                <div className='w-16 h-16 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-300'>
                  <Icon name={"protection" as any}
                    className='w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Healthcare Directives
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Document your medical wishes, power of attorney preferences,
                  and healthcare decisions with easy-to-update templates.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={1.8}>
              <Card className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group'>
                <div className='w-16 h-16 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300'>
                  <Icon name={"financial" as any}
                    className='w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Asset Distribution
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Organize and distribute your financial assets, personal
                  belongings, and digital accounts with clear instructions for
                  beneficiaries.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={2.0}>
              <Card className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group'>
                <div className='w-16 h-16 mx-auto mb-6 bg-rose-500/10 rounded-full flex items-center justify-center group-hover:bg-rose-500/20 transition-colors duration-300'>
                  <Icon name={"wishes" as any}
                    className='w-8 h-8 text-rose-600 group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-4'>Final Wishes</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Record your preferences for funeral arrangements, memorial
                  services, and how you'd like to be remembered by those you
                  love.
                </p>
              </Card>
            </FadeIn>

            <FadeIn duration={0.6} delay={2.2}>
              <Card className='p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group'>
                <div className='w-16 h-16 mx-auto mb-6 bg-indigo-500/10 rounded-full flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-300'>
                  <Icon name={"users" as any}
                    className='w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Guardian Integration
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Seamlessly connect with your trusted guardians to ensure your
                  legacy plans are accessible when they're needed most.
                </p>
              </Card>
            </FadeIn>
          </div>

          {/* Why It Matters Section */}
          <FadeIn duration={0.6} delay={2.4}>
            <Card className='p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16'>
              <div className='max-w-4xl mx-auto text-center'>
                <Icon name={"heart" as any}
                  className='w-12 h-12 text-primary mx-auto mb-6'
                />
                <h3 className='text-2xl font-bold mb-6'>
                  Why Legacy Planning Matters
                </h3>
                <p className='text-lg text-muted-foreground leading-relaxed mb-8'>
                  {firstName}, legacy planning isn't just about legal
                  documents—it's about peace of mind for you and clarity for
                  your loved ones. It's ensuring your voice continues to guide
                  and comfort those you care about, even when you can't be there
                  in person.
                </p>
                <div className='grid md:grid-cols-3 gap-8 text-left'>
                  <div className='flex gap-4'>
                    <Icon name={"shield-check" as any}
                      className='w-6 h-6 text-primary flex-shrink-0 mt-1'
                    />
                    <div>
                      <h4 className='font-semibold mb-2'>Peace of Mind</h4>
                      <p className='text-sm text-muted-foreground'>
                        Know that your wishes will be respected and your family
                        will be cared for.
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <Icon name={"heart" as any}
                      className='w-6 h-6 text-primary flex-shrink-0 mt-1'
                    />
                    <div>
                      <h4 className='font-semibold mb-2'>Family Harmony</h4>
                      <p className='text-sm text-muted-foreground'>
                        Clear instructions prevent confusion and conflict during
                        difficult times.
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <Icon name={"clock" as any}
                      className='w-6 h-6 text-primary flex-shrink-0 mt-1'
                    />
                    <div>
                      <h4 className='font-semibold mb-2'>Time to Connect</h4>
                      <p className='text-sm text-muted-foreground'>
                        Create meaningful messages that will comfort your loved
                        ones for years to come.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Action Section */}
          <FadeIn duration={0.6} delay={2.6}>
            <Card className='p-10 text-center max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'>
              <Icon name={"sparkles" as any}
                className='w-12 h-12 text-primary mx-auto mb-6'
              />
              <h3 className='text-2xl font-bold mb-4'>
                Ready to Secure Your Legacy?
              </h3>
              <p className='text-muted-foreground mb-8'>
                Take the first step towards peace of mind. Our Digital Will
                Creator guides you through every step with personalized
                templates and expert guidance.
              </p>

              <Button
                onClick={handleStartWillCreator}
                size='lg'
                className='bg-primary hover:bg-primary-hover text-primary-foreground px-8'
              >
                <Icon name={"documents" as any} className='w-5 h-5 mr-2' />
                Start Your Will Now
              </Button>

              <p className='text-xs text-muted-foreground mt-4'>
                Free to start • Legal templates included • Save progress anytime
              </p>
            </Card>
          </FadeIn>

          {/* Legal Disclaimer */}
          <FadeIn duration={0.6} delay={2.8}>
            <Card className='mt-12 p-6 bg-muted/30 border-muted'>
              <div className='flex gap-3'>
                <Icon name={"info" as any}
                  className='w-5 h-5 text-muted-foreground flex-shrink-0 mt-1'
                />
                <div>
                  <h4 className='font-semibold mb-2'>Important Legal Notice</h4>
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    While LegacyGuard provides tools and templates to help
                    organize your legacy planning, we strongly recommend
                    consulting with qualified legal and financial professionals
                    to ensure your documents meet all legal requirements in your
                    jurisdiction and properly reflect your intentions.
                  </p>
                </div>
              </div>
            </Card>
          </FadeIn>
        </main>
      </div>
    </DashboardLayout>
  );
}
