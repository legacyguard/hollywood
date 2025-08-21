import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-library";
import { Avatar } from "@/components/ui/avatar";

export default function GuardiansPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <FadeIn duration={0.5} delay={0.2}>
              <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                Guardians
              </h1>
            </FadeIn>
            <FadeIn duration={0.5} delay={0.4}>
              <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                Manage the trusted people who will have access to your information when needed.
              </p>
            </FadeIn>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <FadeIn duration={0.5} delay={0.6}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Guardian cards */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="guardians" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Maria Smith</h3>
                    <p className="text-sm text-muted-foreground">Primary Guardian</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Added: March 15, 2024</p>
                  <p className="text-sm text-muted-foreground">Access: Full</p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="guardians" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Secondary Guardian</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Added: March 20, 2024</p>
                  <p className="text-sm text-muted-foreground">Access: Limited</p>
                </div>
              </Card>

              {/* Add new guardian card */}
              <Card className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Icon name="add" className="w-8 h-8 text-muted-foreground mb-2" />
                  <h3 className="font-semibold text-muted-foreground">Add New Guardian</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Invite someone you trust
                  </p>
                </div>
              </Card>
            </div>
          </FadeIn>

          <FadeIn duration={0.5} delay={0.8}>
            <div className="mt-12">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="info" className="w-5 h-5 text-primary" />
                  About Guardians
                </h3>
                <p className="text-sm text-muted-foreground">
                  Guardians are trusted individuals who can access your information in case of emergency. 
                  You can set different access levels and specify what information each guardian can see.
                </p>
              </Card>
            </div>
          </FadeIn>
        </main>
      </div>
    </DashboardLayout>
  );
}
