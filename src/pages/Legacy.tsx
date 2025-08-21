import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-library";
import { ProgressBar } from "@/components/ProgressBar";

export default function LegacyPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <FadeIn duration={0.5} delay={0.2}>
              <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                Legacy Planning
              </h1>
            </FadeIn>
            <FadeIn duration={0.5} delay={0.4}>
              <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                Create your will, record final wishes, and leave messages for your loved ones.
              </p>
            </FadeIn>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <FadeIn duration={0.5} delay={0.6}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Will Creation */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="documents" className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Last Will & Testament</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Create a legally structured document outlining how your assets should be distributed.
                </p>
                <ProgressBar value={30} label="Will Completion" showPercentage={true} />
                <Button className="mt-4 w-full" variant="outline">
                  Continue Writing Will
                </Button>
              </Card>

              {/* Messages for Future */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="wishes" className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Messages for the Future</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Record personal messages, videos, or letters to be delivered to your loved ones.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium">Letter to my children</p>
                    <p className="text-xs text-muted-foreground">To be opened on their 18th birthday</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Create New Message
                </Button>
              </Card>
            </div>
          </FadeIn>

          <FadeIn duration={0.5} delay={0.8}>
            <div className="grid lg:grid-cols-3 gap-6 mt-8">
              {/* Quick Actions */}
              <Card className="p-6">
                <Icon name="financial" className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Asset Distribution</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Specify how your assets should be divided among beneficiaries.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Manage Assets
                </Button>
              </Card>

              <Card className="p-6">
                <Icon name="protection" className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Healthcare Directives</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Document your medical wishes and power of attorney.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Set Directives
                </Button>
              </Card>

              <Card className="p-6">
                <Icon name="wishes" className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Final Wishes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Record your preferences for funeral arrangements and ceremonies.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Document Wishes
                </Button>
              </Card>
            </div>
          </FadeIn>

          <FadeIn duration={0.5} delay={1.0}>
            <Card className="mt-8 p-6 bg-status-warning/5 border-status-warning/20">
              <div className="flex gap-3">
                <Icon name="info" className="w-5 h-5 text-status-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Important Note</h3>
                  <p className="text-sm text-muted-foreground">
                    While we help you structure your legacy documents, we recommend consulting with a legal professional 
                    to ensure your will and other legal documents meet all requirements in your jurisdiction.
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
