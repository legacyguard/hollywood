import { DashboardLayout } from '@/components/DashboardLayout';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/common/MetaTags';

import { Icon } from '@/components/ui/icon-library';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import EnhancedDocumentUploader from '@/components/features/EnhancedDocumentUploader';
import {
  DataTable,
  createSelectColumn,
  createSortableHeader,
  createActionsColumn,
} from '@/components/enhanced/DataTable';
import { MetricsGrid } from '@/components/enhanced/MetricCard';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Download,
  Eye,
  Trash2,
  Shield,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Document interface
interface Document {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: Date;
  expiresAt?: Date;
  status: 'processed' | 'processing' | 'pending' | 'encrypted';
  ocrStatus?: 'complete' | 'processing' | 'failed' | 'none';
  tags?: string[];
  isEncrypted: boolean;
}

export default function VaultPage() {
  usePageTitle('Vault');
  const [showOcrInfo, setShowOcrInfo] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  // Load documents from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedDocs = localStorage.getItem('vault_documents');
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        // Convert date strings back to Date objects
        const docs = parsed.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
          expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : undefined,
        }));
        setDocuments(docs);
      } else {
        // Initialize with sample data
        const sampleDocs: Document[] = [
          {
            id: '1',
            name: 'Birth Certificate.pdf',
            category: 'Personal',
            size: '2.4 MB',
            uploadedAt: new Date(Date.now() - 86400000 * 30),
            status: 'processed',
            ocrStatus: 'complete',
            tags: ['identity', 'official'],
            isEncrypted: true,
          },
          {
            id: '2',
            name: 'Insurance Policy 2024.pdf',
            category: 'Financial',
            size: '1.8 MB',
            uploadedAt: new Date(Date.now() - 86400000 * 15),
            expiresAt: new Date(Date.now() + 86400000 * 320),
            status: 'processed',
            ocrStatus: 'complete',
            tags: ['health', 'annual'],
            isEncrypted: true,
          },
          {
            id: '3',
            name: 'Property Deed.pdf',
            category: 'Property',
            size: '5.2 MB',
            uploadedAt: new Date(Date.now() - 86400000 * 7),
            status: 'processed',
            ocrStatus: 'complete',
            tags: ['real-estate', 'ownership'],
            isEncrypted: true,
          },
          {
            id: '4',
            name: 'Will Draft v3.docx',
            category: 'Legal',
            size: '345 KB',
            uploadedAt: new Date(Date.now() - 86400000 * 2),
            status: 'processing',
            ocrStatus: 'processing',
            tags: ['draft', 'inheritance'],
            isEncrypted: false,
          },
          {
            id: '5',
            name: 'Medical Records 2024.pdf',
            category: 'Health',
            size: '3.1 MB',
            uploadedAt: new Date(Date.now() - 86400000 * 1),
            status: 'pending',
            ocrStatus: 'none',
            tags: ['medical', 'records'],
            isEncrypted: false,
          },
        ];
        setDocuments(sampleDocs);
        localStorage.setItem('vault_documents', JSON.stringify(sampleDocs));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [refreshTrigger]);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('vault_documents', JSON.stringify(documents));
    }
  }, [documents]);

  // Calculate metrics
  const metrics = useMemo(
    () => [
      {
        title: 'Total Documents',
        value: documents.length.toString(),
        icon: 'file-text',
        color: 'primary',
        change: 12,
        trend: 'up',
      },
      {
        title: 'Encrypted',
        value: documents.filter(d => d.isEncrypted).length.toString(),
        icon: 'lock',
        color: 'success',
        changeLabel: 'Secured',
      },
      {
        title: 'OCR Processed',
        value: documents
          .filter(d => d.ocrStatus === 'complete')
          .length.toString(),
        icon: 'scan',
        color: 'info',
        changeLabel: 'Searchable',
      },
      {
        title: 'Expiring Soon',
        value: documents
          .filter(d => {
            if (!d.expiresAt) return false;
            const daysUntilExpiry = Math.floor(
              (d.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilExpiry <= 90;
          })
          .length.toString(),
        icon: 'alert-circle',
        color: 'warning',
        changeLabel: 'Within 90 days',
      },
    ],
    [documents]
  );

  // Define columns for DataTable
  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      createSelectColumn<Document>(),
      {
        accessorKey: 'name',
        header: createSortableHeader('Document Name'),
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className='flex items-center space-x-2'>
              {doc.isEncrypted && <Shield className='h-4 w-4 text-green-600' />}
              <span className='font-medium'>{doc.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: createSortableHeader('Category'),
        cell: ({ row }) => (
          <Badge variant={"outline" as any} className='text-xs'>
            {row.getValue('category')}
          </Badge>
        ),
      },
      {
        accessorKey: 'size',
        header: 'Size',
      },
      {
        accessorKey: 'uploadedAt',
        header: createSortableHeader('Uploaded'),
        cell: ({ row }) => {
          const date = row.getValue('uploadedAt') as Date;
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(date);
        },
      },
      {
        accessorKey: 'expiresAt',
        header: 'Expires',
        cell: ({ row }) => {
          const date = row.getValue('expiresAt') as Date | undefined;
          if (!date) return <span className='text-muted-foreground'>-</span>;

          const daysUntilExpiry = Math.floor(
            (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const isExpiringSoon = daysUntilExpiry <= 90;

          return (
            <div className='flex items-center space-x-1'>
              {isExpiringSoon && <Clock className='h-3 w-3 text-yellow-600' />}
              <span
                className={isExpiringSoon ? 'text-yellow-600 font-medium' : ''}
              >
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(date)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'ocrStatus',
        header: 'OCR Status',
        cell: ({ row }) => {
          const status = row.getValue('ocrStatus') as string | undefined;
          if (!status || status === 'none')
            return <span className='text-muted-foreground'>-</span>;

          const statusConfig = {
            complete: {
              color: 'bg-green-100 text-green-800',
              icon: CheckCircle,
              label: 'Complete',
            },
            processing: {
              color: 'bg-yellow-100 text-yellow-800',
              icon: Clock,
              label: 'Processing',
            },
            failed: {
              color: 'bg-red-100 text-red-800',
              icon: null,
              label: 'Failed',
            },
          };

          const config = statusConfig[status as keyof typeof statusConfig];
          const StatusIcon = config?.icon;

          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config?.color || ''}`}
            >
              {StatusIcon && <StatusIcon className='h-3 w-3 mr-1' />}
              {config?.label || status}
            </span>
          );
        },
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const tags = row.getValue('tags') as string[] | undefined;
          if (!tags || tags.length === 0) return null;
          return (
            <div className='flex flex-wrap gap-1'>
              {tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant={"secondary" as any} className='text-xs'>
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant={"secondary" as any} className='text-xs'>
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      createActionsColumn<Document>([
        {
          label: 'View',
          icon: <Eye className='h-4 w-4 mr-2' />,
          onClick: doc => {
            toast.info(`Opening ${doc.name}`);
            // In production, this would open the document viewer
          },
        },
        {
          label: 'Download',
          icon: <Download className='h-4 w-4 mr-2' />,
          onClick: doc => {
            toast.success(`Downloading ${doc.name}`);
            // In production, this would trigger the download
          },
        },
        {
          label: 'Delete',
          icon: <Trash2 className='h-4 w-4 mr-2' />,
          onClick: doc => {
            setDocumentToDelete(doc);
            setIsConfirmDialogOpen(true);
          },
        },
      ]),
    ],
    []
  );

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!documentToDelete) return;

    setDocuments(prev => prev.filter(d => d.id !== documentToDelete.id));
    toast.success(`Deleted ${documentToDelete.name}`);

    // Close dialog and reset state
    setIsConfirmDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setIsConfirmDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Size', 'Uploaded', 'Status', 'Encrypted'],
      ...documents.map(doc => [
        doc.name,
        doc.category,
        doc.size,
        doc.uploadedAt.toISOString(),
        doc.status,
        doc.isEncrypted ? 'Yes' : 'No',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-documents-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Documents exported successfully');
  };

  return (
    <>
      <MetaTags 
        title="Document Vault"
        description="Securely store and automatically analyze your important documents with AI-powered OCR technology. Your digital vault for all important documents."
        keywords="document vault, secure storage, AI OCR, document analysis, encrypted documents"
      />
      <DashboardLayout>
        <div className='min-h-screen bg-background'>
        <header className='bg-card border-b border-card-border'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8'>
            <FadeIn duration={0.5} delay={0.2}>
              <h1 className='text-3xl lg:text-4xl font-bold font-heading text-card-foreground mb-3'>
                My Vault
              </h1>
            </FadeIn>
            <FadeIn duration={0.5} delay={0.4}>
              <p
                className='text-lg leading-relaxed max-w-2xl'
                style={{  color: 'hsl(var(--muted-text))'  }}
              >
                Securely store and automatically analyze your important
                documents with AI-powered OCR technology.
              </p>
            </FadeIn>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
          <div className='space-y-8'>
            {/* Metrics Overview */}
            <FadeIn duration={0.5} delay={0.6}>
              <MetricsGrid metrics={metrics} columns={4} />
            </FadeIn>

            {/* OCR Feature Information */}
            {showOcrInfo && (
              <FadeIn duration={0.5} delay={0.8}>
                <Alert className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
                  <Icon name={"sparkles" as any} className='h-4 w-4 text-blue-600' />
                  <AlertDescription className='flex items-center justify-between'>
                    <div>
                      <strong className='text-blue-900'>
                        ✨ AI-Powered Document Analysis Now Available!
                      </strong>
                      <p className='text-blue-700 mt-1'>
                        Upload any document and our AI will automatically
                        extract text, classify document types, identify
                        important information like dates and amounts, and make
                        your documents searchable.
                      </p>
                    </div>
                    <Button
                      variant={"ghost" as any}
                      size='sm'
                      onClick={() => setShowOcrInfo(false)}
                      className='text-blue-600 hover:text-blue-800 ml-4'
                    >
                      <Icon name={"x" as any} className='h-4 w-4' />
                    </Button>
                  </AlertDescription>
                </Alert>
              </FadeIn>
            )}

            {/* Enhanced Upload Section with OCR */}
            <div>
              <EnhancedDocumentUploader />
              <Button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                variant={"outline" as any}
                size='sm'
                className='mt-4'
              >
                <Icon name={"refresh-cw" as any} className='h-4 w-4 mr-2' />
                Refresh Documents
              </Button>
            </div>

            {/* Enhanced Documents Table */}
            <FadeIn duration={0.5} delay={1}>
              <DataTable
                columns={columns}
                data={documents}
                title='Document Vault'
                description='All your protected documents in one secure place'
                searchPlaceholder='Search documents by name, category, or tags...'
                loading={isLoading}
                onExport={handleExport}
                pageSize={10}
              />
            </FadeIn>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </DashboardLayout>
      </>
    );
}
