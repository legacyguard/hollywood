import { Icon } from "@/components/ui/icon-library";
import { Button } from "@/components/ui/button";
import { PillarCard } from "@/components/PillarCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FadeIn } from "@/components/motion/FadeIn";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export function DashboardContent() {
  const { user } = useUser();
  
  const handleNewInformation = () => {
    console.log("Add new information clicked");
  };

  const handleViewVault = () => {
    console.log("View vault clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                    Welcome{user?.firstName ? `, ${user.firstName}` : ''}. I'm here to help you.
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                    Welcome back, Jana. It's wonderful to see you taking these important steps for your family.
                  </p>
                </FadeIn>
              </div>
            </div>
            <FadeIn duration={0.5} delay={0.6}>
              <Button 
                onClick={handleNewInformation}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
                size="lg"
              >
                <Icon name="add" className="w-5 h-5 mr-2" />
                Secure a New Information
              </Button>
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pillar 1: TODAY - Your Organized Life (Active) */}
          <FadeIn duration={0.5} delay={0.8}>
            <PillarCard
              title="TODAY - Your Organized Life"
              subtitle="Track your progress and stay organized with your important information."
              icon="success"
              isActive={true}
              actionButton={{
                text: "View My Vault",
                onClick: handleViewVault,
                href: "/vault",
              }}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary font-heading">12</div>
                    <div className="text-sm text-muted-foreground">Informations Secured</div>
                  </div>
                  <div className="text-center p-4 bg-status-warning/10 rounded-lg">
                    <div className="text-2xl font-bold text-status-warning font-heading">2</div>
                    <div className="text-sm text-muted-foreground">Upcoming Deadlines</div>
                  </div>
                </div>
                
                <ProgressBar 
                  value={45} 
                  label="Profile Completion" 
                  showPercentage={true}
                />
              </div>
            </PillarCard>
          </FadeIn>

          {/* Pillar 2: TOMORROW - Your Family's Protection (Locked) */}
          <FadeIn duration={0.5} delay={1.0}>
            <PillarCard
              title="TOMORROW - Your Family's Protection"
              subtitle="You're building strong foundations. When you're ready, I'll gently unlock this next chapter to help protect your family during unexpected moments."
              icon="protection"
              isLocked={true}
            />
          </FadeIn>

          {/* Pillar 3: FOREVER - Your Enduring Legacy (Locked) */}
          <FadeIn duration={0.5} delay={1.2}>
            <PillarCard
              title="FOREVER - Your Enduring Legacy"
              subtitle="This chapter awaits when the time feels right. Together, we'll preserve your wishes and stories for generations to come."
              icon="infinity"
              isLocked={true}
            />
          </FadeIn>
        </div>

        {/* Quick Actions Section */}
        <section className="mt-16">
          <FadeIn duration={0.5} delay={1.4}>
            <h2 className="text-2xl font-bold font-heading text-card-foreground mb-6">
              Quick Actions
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FadeIn duration={0.5} delay={1.5}>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
                onClick={handleNewInformation}
              >
                <Icon name="add" className="w-5 h-5" />
                <span className="text-sm">Add Information</span>
              </Button>
            </FadeIn>
            
            <FadeIn duration={0.5} delay={1.6}>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
                onClick={handleViewVault}
              >
                <Icon name="documents" className="w-5 h-5" />
                <span className="text-sm">Review Progress</span>
              </Button>
            </FadeIn>
            
            <FadeIn duration={0.5} delay={1.7}>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 cursor-not-allowed opacity-60"
                disabled
              >
                <Icon name="guardians" className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Set Emergency Contacts</span>
              </Button>
            </FadeIn>
            
            <FadeIn duration={0.5} delay={1.8}>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 cursor-not-allowed opacity-60"
                disabled
              >
                <Icon name="wishes" className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Create Legacy Content</span>
              </Button>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}