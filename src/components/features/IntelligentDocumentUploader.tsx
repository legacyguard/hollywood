"use client";

import React, { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { DocumentConfirmation } from './DocumentConfirmation';
import { 
  getUserEncryptionKeys, 
  encryptFile, 
  createEncryptedBlob 
} from '@/lib/encryption';
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
  const createSupabaseClient = useSupabaseClient();

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
          fileType: file.type
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
  }, [file]);

  const handleConfirmAndSave = async (confirmedData: DocumentAnalysisResult) => {
    if (!file || !userId) return;

    setPhase('saving');
    setUploadProgress(0);

    try {
      // Create Supabase client with Clerk token
      const supabase = await createSupabaseClient();
      
      // Get user's encryption keys
      const keys = getUserEncryptionKeys(userId);
      
      setUploadProgress(20);
      
      // Encrypt the file
      const { encryptedData, nonce, metadata } = await encryptFile(
        file,
        keys.publicKey,
        keys.secretKey
      );
      
      setUploadProgress(50);
      
      // Create encrypted blob
      const encryptedBlob = createEncryptedBlob(encryptedData, nonce);
      
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
      const { error: dbError } = await supabase
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
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to delete the uploaded file if database insert fails
        await supabase.storage
          .from('user_documents')
          .remove([filePath]);
        throw new Error('Failed to save document metadata');
      }
      
      setUploadProgress(100);
      
      toast.success('Document saved successfully with AI analysis!');
      
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