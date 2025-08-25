import { Icon } from "@/components/ui/icon-library";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FadeIn } from "@/components/motion/FadeIn";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { PathOfSerenity } from "@/components/dashboard/PathOfSerenity";
import { AttentionSection } from "@/components/dashboard/AttentionSection";
import { LegacyOverviewSection } from "@/components/dashboard/LegacyOverviewSection";
import { useEncryptionReady } from "@/hooks/encryption/useEncryption";
import { EncryptionSetup } from "@/components/encryption/EncryptionSetup";

export function DashboardContent() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { needsSetup, isLoading } = useEncryptionReady();
  
  // Show encryption setup if needed
  if (!isLoading && needsSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <EncryptionSetup />
      </div>
    );
  }
  
  const handleNewInformation = () => {
    navigate('/vault');
  };

  const handleViewVault = () => {
    navigate('/vault');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Family Shield Dashboard */}
      <header className="bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <FadeIn duration={0.5} delay={0.2}>
                  <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                    Family Shield{user?.firstName ? `, ${user.firstName}` : ''}
                  </h1>
                </FadeIn>
                <FadeIn duration={0.5} delay={0.4}>
                  <p className="text-lg leading-relaxed max-w-2xl text-muted-foreground">
                    Overview of everything protecting your family
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
                Secure New Information
              </Button>
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
        {/* 1. Section: Path of Serenity (Compact version) */}
        <PathOfSerenity className="max-w-4xl mx-auto" />

        {/* 2. Section: Current Challenges (Dynamic action zone) */}
        <AttentionSection />

        {/* 3. Section: Shield Areas Overview (Bundle cards) */}
        <LegacyOverviewSection />
      </main>
    </div>
  );
}