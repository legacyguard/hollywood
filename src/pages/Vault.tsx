import { DashboardLayout } from "@/components/DashboardLayout";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-library";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EnhancedDocumentUploader from "@/components/features/EnhancedDocumentUploader";
import { DocumentList } from "@/components/features/DocumentList";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useState } from "react";

export default function VaultPage() {
  usePageTitle('Vault');
  const [showOcrInfo, setShowOcrInfo] = useState(true);

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
                Securely store and automatically analyze your important documents with AI-powered OCR technology.
              </p>
            </FadeIn>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* OCR Feature Information */}
            {showOcrInfo && (
              <FadeIn duration={0.5} delay={0.6}>
                <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <Icon name="sparkles" className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <strong className="text-blue-900">✨ AI-Powered Document Analysis Now Available!</strong>
                      <p className="text-blue-700 mt-1">
                        Upload any document and our AI will automatically extract text, classify document types, 
                        identify important information like dates and amounts, and make your documents searchable.
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowOcrInfo(false)}
                      className="text-blue-600 hover:text-blue-800 ml-4"
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              </FadeIn>
            )}

            {/* Enhanced Upload Section with OCR */}
            <EnhancedDocumentUploader />
            
            {/* Documents List with OCR Search */}
            <DocumentList />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
