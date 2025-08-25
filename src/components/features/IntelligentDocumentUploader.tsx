"use client";

import React, { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { DocumentConfirmation } from './DocumentConfirmation';
import { encryptionService } from '@/lib/encryption-v2';
import { toast } from 'sonner';

// Document analysis result interface matching our Supabase Edge Function
interface DocumentAnalysisResult {
  extractedText: string;
  confidence: number;
  suggestedCategory: {
    category: string;
    confidence: number;
    icon: string;
    reasoning: string;
  };
  suggestedTitle: {
    title: string;
    confidence: number;
    reasoning: string;
  };
  expirationDate: {
    date: string | null;
    confidence: number;
    originalText?: string;
    reasoning: string;
  };
  keyData: Array<{
    label: string;
    value: string;
    confidence: number;
    type: 'amount' | 'account' | 'reference' | 'contact' | 'other';
  }>;
  suggestedTags: string[];
  
  // Bundle Intelligence (Phase 2)
  potentialBundles: Array<{
    bundleId: string;
    bundleName: string;
    bundleCategory: string;
    primaryEntity: string;
    documentCount: number;
    matchScore: number;
    matchReasons: string[];
  }>;
  
  suggestedNewBundle: {
    name: string;
    category: string;
    primaryEntity: string | null;
    entityType: string | null;
    keywords: string[];
    confidence: number;
    reasoning: string;
  } | null;
  
  // Document Versioning (Phase 3)
  potentialVersions: Array<{
    documentId: string;
    fileName: string;
    versionNumber: number;
    versionDate: string;
    similarityScore: number;
    matchReasons: string[];
  }>;
  
  versioningSuggestion: {
    action: 'replace' | 'new_version' | 'separate';
    confidence: number;
    reasoning: string;
    suggestedArchiveReason?: string;
  } | null;
  
  processingId: string;
  processingTime: number;
}

type UploadPhase = 'select' | 'analyzing' | 'confirm' | 'saving';

export const IntelligentDocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>('select');
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { userId } = useAuth();
  const { user } = useUser();
  const createSupabaseClient = useSupabaseWithClerk();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Please select a supported file type (PDF, images, or documents)');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const analyzeDocument = useCallback(async () => {
    if (!file) return;

    setPhase('analyzing');
    setUploadProgress(0);
    
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      setUploadProgress(25);

      // Call our intelligent document analyzer Edge Function
      const response = await fetch('/api/v1/supabase/functions/intelligent-document-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: file.name,
          fileType: file.type,
          userId: userId // Include userId for bundle detection
        })
      });

      setUploadProgress(75);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAnalysisResult(result.result);
      setPhase('confirm');
      setUploadProgress(100);
      
      toast.success('Document analyzed successfully!');

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze document');
      setPhase('select');
      setUploadProgress(0);
    }
  }, [file, userId]);

  const handleConfirmAndSave = async (confirmedData: DocumentAnalysisResult & {
    bundleSelection?: {
      action: 'link' | 'new' | 'none';
      bundleId: string | null;
      newBundleName: string | null;
      suggestedNewBundle: {
        name: string;
        category: string;
        primaryEntity: string | null;
        entityType: string | null;
        keywords: string[];
        confidence: number;
        reasoning: string;
      } | null;
    };
    versionSelection?: {
      action: 'replace' | 'new_version' | 'separate' | 'none';
      versionId: string | null;
      archiveReason: string;
    };
  }) => {
    if (!file || !userId) return;

    setPhase('saving');
    setUploadProgress(0);

    try {
      // Create Supabase client with Clerk token
      const supabase = await createSupabaseClient();
      
      setUploadProgress(20);
      
      // Encrypt the file using secure service
      const encryptionResult = await encryptionService.encryptFile(file);
      
      if (!encryptionResult) {
        throw new Error('Failed to encrypt file. Please check your encryption setup.');
      }
      
      const { encryptedData, nonce, metadata } = encryptionResult;
      
      setUploadProgress(50);
      
      // Create encrypted blob
      const encryptedBlob = new Blob([nonce, encryptedData], { type: 'application/octet-stream' });
      
      // Generate unique file name
      const timestamp = Date.now();
      const encryptedFileName = `${timestamp}_${file.name}.encrypted`;
      const filePath = `${userId}/${encryptedFileName}`;
      
      setUploadProgress(70);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_documents')
        .upload(filePath, encryptedBlob, {
          contentType: 'application/octet-stream',
          upsert: false
        });

      if (error) {
        if (error.message.includes('bucket')) {
          throw new Error('Storage bucket not configured. Please set up Supabase Storage.');
        }
        throw error;
      }
      
      setUploadProgress(90);
      
      // Save document metadata with AI analysis results
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          file_name: confirmedData.suggestedTitle.title || file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          document_type: confirmedData.suggestedCategory.category,
          category: confirmedData.suggestedCategory.category,
          // Store AI analysis results as metadata
          ai_extracted_text: confirmedData.extractedText,
          ai_confidence: confirmedData.confidence,
          ai_suggested_tags: confirmedData.suggestedTags,
          expiration_date: confirmedData.expirationDate.date,
          ai_key_data: confirmedData.keyData,
          ai_processing_id: confirmedData.processingId,
          encrypted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to delete the uploaded file if database insert fails
        await supabase.storage
          .from('user_documents')
          .remove([filePath]);
        throw new Error('Failed to save document metadata');
      }

      // Phase 2: Handle Bundle Linking
      if (confirmedData.bundleSelection && documentData) {
        try {
          const bundleSelection = confirmedData.bundleSelection;
          
          if (bundleSelection.action === 'link' && bundleSelection.bundleId) {
            // Link to existing bundle
            const { error: linkError } = await supabase.rpc('link_document_to_bundle', {
              p_document_id: documentData.id,
              p_bundle_id: bundleSelection.bundleId,
              p_user_id: userId
            });
            
            if (linkError) {
              console.error('Bundle linking error:', linkError);
              // Don't fail the entire operation if bundle linking fails
              toast.warning('Document saved but failed to link to bundle');
            } else {
              toast.success(`Document linked to bundle successfully!`);
            }
            
          } else if (bundleSelection.action === 'new' && bundleSelection.newBundleName) {
            // Create new bundle and link document
            const newBundle = bundleSelection.suggestedNewBundle;
            const { error: createError } = await supabase.rpc('create_bundle_and_link_document', {
              p_user_id: userId,
              p_bundle_name: bundleSelection.newBundleName,
              p_bundle_category: newBundle?.category || confirmedData.suggestedCategory.category,
              p_document_id: documentData.id,
              p_description: newBundle?.reasoning || null,
              p_primary_entity: newBundle?.primaryEntity || null,
              p_entity_type: newBundle?.entityType || null,
              p_keywords: newBundle?.keywords || confirmedData.suggestedTags
            });
            
            if (createError) {
              console.error('Bundle creation error:', createError);
              // Don't fail the entire operation if bundle creation fails
              toast.warning('Document saved but failed to create bundle');
            } else {
              toast.success(`New bundle "${bundleSelection.newBundleName}" created and document linked!`);
            }
          }
          
        } catch (bundleError) {
          console.error('Bundle handling error:', bundleError);
          // Don't fail the entire operation if bundle handling fails
          toast.warning('Document saved but bundle operation failed');
        }
      }
      
      // Phase 3: Handle Document Versioning
      if (confirmedData.versionSelection && documentData) {
        try {
          const versionSelection = confirmedData.versionSelection;
          
          if (versionSelection.action === 'replace' && versionSelection.versionId) {
            // Archive old document and create version chain
            const { error: archiveError } = await supabase.rpc('archive_document_and_create_version', {
              old_document_id: versionSelection.versionId,
              new_document_id: documentData.id,
              archive_reason: versionSelection.archiveReason || 'Replaced by newer version'
            });
            
            if (archiveError) {
              console.error('Document archiving error:', archiveError);
              // Don't fail the entire operation if versioning fails
              toast.warning('Document saved but failed to archive old version');
            } else {
              toast.success('Old document version archived and replaced successfully!');
            }
            
          } else if (versionSelection.action === 'new_version' && versionSelection.versionId) {
            // Create new version without archiving the old one
            const { error: versionError } = await supabase.rpc('create_document_version', {
              original_document_id: versionSelection.versionId,
              new_document_id: documentData.id
            });
            
            if (versionError) {
              console.error('Version creation error:', versionError);
              // Don't fail the entire operation if versioning fails
              toast.warning('Document saved but failed to create version link');
            } else {
              toast.success('New document version created successfully!');
            }
          }
          
        } catch (versionError) {
          console.error('Version handling error:', versionError);
          // Don't fail the entire operation if version handling fails
          toast.warning('Document saved but version operation failed');
        }
      }
      
      setUploadProgress(100);
      
      // Show appropriate success message based on operations performed
      const bundleActionTaken = confirmedData.bundleSelection && confirmedData.bundleSelection.action !== 'none';
      const versionActionTaken = confirmedData.versionSelection && confirmedData.versionSelection.action !== 'none';
      
      if (!bundleActionTaken && !versionActionTaken) {
        toast.success('Document saved successfully with AI analysis!');
      } else if (!bundleActionTaken && versionActionTaken) {
        // Version message already shown above
      } else if (bundleActionTaken && !versionActionTaken) {
        // Bundle message already shown above
      }
      // If both actions taken, individual messages already shown
      
      // Emit event to refresh document list
      window.dispatchEvent(new CustomEvent('documentUploaded', { detail: { userId } }));
      
      // Reset form
      setFile(null);
      setAnalysisResult(null);
      setPhase('select');
      setUploadProgress(0);
      
      const fileInput = document.getElementById('intelligent-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: unknown) {
      console.error('Error saving document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save document. Please try again.');
      setPhase('confirm'); // Go back to confirmation screen
    }
  };

  const handleCancel = () => {
    setFile(null);
    setAnalysisResult(null);
    setPhase('select');
    setUploadProgress(0);
    
    const fileInput = document.getElementById('intelligent-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Render confirmation screen
  if (phase === 'confirm' && file && analysisResult) {
    return (
      <DocumentConfirmation
        file={file}
        analysisResult={analysisResult}
        onConfirm={handleConfirmAndSave}
        onCancel={handleCancel}
        isProcessing={phase === 'saving'}
      />
    );
  }

  // Render upload screen
  return (
    <FadeIn duration={0.5} delay={0.3}>
      <Card className="p-6 bg-card border-card-border max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="brain" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Intelligent Document Organizer</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered document analysis and categorization
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              id="intelligent-file-input"
              type="file" 
              onChange={handleFileChange}
              className="flex-1"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
              disabled={phase !== 'select'}
            />
            <Button 
              onClick={analyzeDocument} 
              disabled={!file || phase !== 'select'}
              className="min-w-[140px]"
            >
              {phase === 'analyzing' ? (
                <>
                  <Icon name="brain" className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Icon name="search" className="w-4 h-4 mr-2" />
                  Analyze Document
                </>
              )}
            </Button>
          </div>
          
          {phase === 'analyzing' && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Thank you. Analyzing document to save you work...
                </span>
                <span className="text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="search" className="w-4 h-4 animate-pulse" />
                <span>Extracting text and analyzing content...</span>
              </div>
            </div>
          )}
          
          {file && phase === 'select' && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <Icon name="documents" className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex gap-2">
            <Icon name="sparkles" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">AI-Powered Organization</p>
              <p>Our system automatically categorizes your document, extracts key information, and suggests organization. You can review and adjust before saving.</p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};