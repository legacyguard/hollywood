"use client";

import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSupabaseWithClerk } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { useEncryption } from '@/hooks/useEncryption';
import { toast } from 'sonner';

export const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { userId } = useAuth();
  const { user } = useUser();
  const createSupabaseClient = useSupabaseWithClerk();
  const { isUnlocked, encryptFile, showPasswordPrompt } = useEncryption();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (max 10MB for MVP)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) {
      toast.error('Please select a file to upload.');
      return;
    }

    // Check if encryption is unlocked
    if (!isUnlocked) {
      showPasswordPrompt();
      toast.info('Please unlock encryption to upload documents');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create Supabase client with Clerk token
      const supabase = await createSupabaseClient();

      // Update progress
      setUploadProgress(20);

      // Encrypt the file using new encryption service
      const encryptionResult = await encryptFile(file);

      if (!encryptionResult) {
        throw new Error('Failed to encrypt file');
      }

      const { encryptedData, nonce, metadata } = encryptionResult;

      setUploadProgress(50);

      // Create encrypted blob from Uint8Array
      const encryptedBlob = new Blob([encryptedData], { type: 'application/octet-stream' });

      // Generate unique file name
      const timestamp = Date.now();
      const encryptedFileName = `${timestamp}_${file.name}.encrypted`;
      const filePath = `${userId}/${encryptedFileName}`;

      setUploadProgress(70);

      // Upload to Supabase Storage s autentifikovaným klientom
      const { data, error } = await supabase.storage
        .from('user_documents')
        .upload(filePath, encryptedBlob, {
          contentType: 'application/octet-stream',
          upsert: false
        });

      if (error) {
        // If bucket doesn't exist, show helpful message
        if (error.message.includes('bucket')) {
          throw new Error('Storage bucket not configured. Please set up Supabase Storage.');
        }
        throw error;
      }

      setUploadProgress(90);

      // Save metadata to database
      // Pre development posielame user_id explicitne
      // Store nonce with document for decryption
      const nonceBase64 = btoa(String.fromCharCode(...nonce));

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: userId, // Explicitne posielame Clerk user ID
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          document_type: 'General',
          encrypted_at: new Date().toISOString(),
          encryption_nonce: nonceBase64
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Try to delete the uploaded file if database insert fails
        await supabase.storage
          .from('user_documents')
          .remove([filePath]);
        throw new Error('Failed to save document metadata');
      }

      // No longer storing in localStorage - all handled server-side

      setUploadProgress(100);

      toast.success('Document encrypted and uploaded successfully!');

      // Emit event to refresh document list
      window.dispatchEvent(new CustomEvent('documentUploaded', { detail: { userId } }));

      // Reset form
      setFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <FadeIn duration={0.5} delay={0.3}>
      <Card className="p-6 bg-card border-card-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="upload" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Secure Document Upload</h3>
            <p className="text-sm text-muted-foreground">
              Your documents are encrypted before leaving your device
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="flex-1"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              disabled={isUploading}
            />
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Icon name="upload" className="w-4 h-4 mr-2 animate-pulse" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Icon name="upload" className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing...</span>
                <span className="text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {file && !isUploading && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <Icon name="documents" className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-status-warning/10 rounded-lg">
          <div className="flex gap-2">
            <Icon name="info" className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">End-to-End Encryption</p>
              <p>Your files are encrypted on your device before upload. Only you can decrypt them with your personal key.</p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};
