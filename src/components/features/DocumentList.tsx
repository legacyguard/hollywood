import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { format } from 'date-fns';

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  encryptedAt: string;
  filePath: string;
}

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;
    
    // Load documents from localStorage
    const documentsKey = `documents_${userId}`;
    const storedDocs = localStorage.getItem(documentsKey);
    
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  }, [userId]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'documents';
    if (fileType.includes('image')) return 'eye';
    if (fileType.includes('doc')) return 'documents';
    return 'documents';
  };

  if (documents.length === 0) {
    return (
      <FadeIn duration={0.5} delay={0.5}>
        <Card className="p-12 text-center bg-card border-card-border">
          <Icon name="documents" className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground">
            Upload your first document to get started with secure storage
          </p>
        </Card>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-4">
      <FadeIn duration={0.5} delay={0.5}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Encrypted Documents</h3>
          <span className="text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </FadeIn>

      <div className="grid gap-3">
        {documents.map((doc, index) => (
          <FadeIn key={doc.id} duration={0.5} delay={0.6 + index * 0.1}>
            <Card className="p-4 bg-card border-card-border hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name={getFileIcon(doc.fileType) as any} className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>Encrypted {format(new Date(doc.encryptedAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Icon name="locked" className="w-3 h-3" />
                        Secure
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    disabled
                    title="Download feature coming soon"
                  >
                    <Icon name="download" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-status-error"
                    disabled
                    title="Delete feature coming soon"
                  >
                    <Icon name="delete" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
