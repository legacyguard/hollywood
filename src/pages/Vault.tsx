import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-library";

export default function VaultPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <FadeIn duration={0.5} delay={0.2}>
              <h1 className="text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3">
                My Vault
              </h1>
            </FadeIn>
            <FadeIn duration={0.5} delay={0.4}>
              <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'hsl(var(--muted-text))' }}>
                This is where all your secured documents and information will be safely stored.
              </p>
            </FadeIn>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <FadeIn duration={0.5} delay={0.6}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Document cards placeholder */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Icon name="documents" className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Insurance Policies</h3>
                <p className="text-sm text-muted-foreground">3 documents</p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Icon name="financial" className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Financial Records</h3>
                <p className="text-sm text-muted-foreground">5 documents</p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Icon name="protection" className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Legal Documents</h3>
                <p className="text-sm text-muted-foreground">2 documents</p>
              </Card>
            </div>
          </FadeIn>

          <FadeIn duration={0.5} delay={0.8}>
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                <Icon name="add" className="w-5 h-5 mr-2" />
                Add New Document
              </Button>
            </div>
          </FadeIn>
        </main>
      </div>
    </DashboardLayout>
  );
}
