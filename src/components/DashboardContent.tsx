import { CheckCircle, Shield, Infinity, Plus, SidebarOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarCard } from "@/components/PillarCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardContent() {
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
                <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                  Your Peace of Mind Dashboard
                </h1>
                <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                  Welcome back, Jana. It's wonderful to see you taking these important steps for your family.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleNewInformation}
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Secure a New Information
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pillar 1: TODAY - Your Organized Life (Active) */}
          <PillarCard
            title="TODAY - Your Organized Life"
            subtitle="Track your progress and stay organized with your important information."
            icon={CheckCircle}
            isActive={true}
            actionButton={{
              text: "View My Vault",
              onClick: handleViewVault,
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

          {/* Pillar 2: TOMORROW - Your Family's Protection (Locked) */}
          <PillarCard
            title="TOMORROW - Your Family's Protection"
            subtitle="Once you've built a solid foundation, we'll unlock this next chapter to protect your family in emergencies."
            icon={Shield}
            isLocked={true}
          />

          {/* Pillar 3: FOREVER - Your Enduring Legacy (Locked) */}
          <PillarCard
            title="FOREVER - Your Enduring Legacy"
            subtitle="This is the final step of your journey, where you can preserve your wishes and stories for generations to come."
            icon={Infinity}
            isLocked={true}
          />
        </div>

        {/* Quick Actions Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold font-heading text-card-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              onClick={handleNewInformation}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Information</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              onClick={handleViewVault}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Review Progress</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 cursor-not-allowed"
              disabled
              style={{ color: 'hsl(var(--muted-text) / 0.7)', borderColor: 'hsl(var(--muted-text) / 0.5)' }}
            >
              <Shield className="w-5 h-5" style={{ color: 'hsl(var(--muted-text) / 0.7)' }} />
              <span className="text-sm">Set Emergency Contacts</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 cursor-not-allowed"
              disabled
              style={{ color: 'hsl(var(--muted-text) / 0.7)', borderColor: 'hsl(var(--muted-text) / 0.5)' }}
            >
              <Infinity className="w-5 h-5" style={{ color: 'hsl(var(--muted-text) / 0.7)' }} />
              <span className="text-sm">Create Legacy Content</span>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}