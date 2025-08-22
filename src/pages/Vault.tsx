import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-library";
import { DocumentUploader } from "@/components/features/DocumentUploader";
import { DocumentList } from "@/components/features/DocumentList";

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
          <div className="space-y-8">
            {/* Upload Section */}
            <DocumentUploader />
            
            {/* Documents List */}
            <DocumentList />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
