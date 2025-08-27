/**
 * BackupRestore Component - User interface for data backup and restore
 * Provides export/import functionality with visual feedback
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { backupService } from '@/services/backupService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

export function BackupRestore() {
  const { userId } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupSize, setBackupSize] = useState<string>('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [encryptBackup, setEncryptBackup] = useState(true);
  const [exportPassword, setExportPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [showExportPassword, setShowExportPassword] = useState(false);
  const [showImportPassword, setShowImportPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Load last backup date from localStorage
    if (userId) {
      const lastBackup = localStorage.getItem(`lastBackup_${userId}`);
      if (lastBackup) {
        setLastBackupDate(new Date(lastBackup).toLocaleDateString());
      }

      // Estimate backup size
      backupService.estimateBackupSize(userId).then(size => {
        setBackupSize(size);
      });
    }
  }, [userId]);

  const handleExport = async () => {
    if (!userId) {
      toast.error('You must be logged in to export data');
      return;
    }

    if (encryptBackup && !exportPassword) {
      toast.error('Please enter a password to encrypt your backup');
      return;
    }

    if (encryptBackup && exportPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsExporting(true);
    try {
      await backupService.exportData(
        userId,
        encryptBackup ? exportPassword : undefined
      );

      // Save last backup date
      const now = new Date().toISOString();
      localStorage.setItem(`lastBackup_${userId}`, now);
      setLastBackupDate(new Date(now).toLocaleDateString());
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
      toast.error('Please select a valid backup file (.json)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Backup file is too large (max 10MB)');
      return;
    }

    setSelectedFile(file);

    // Check if file is encrypted by reading first part
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (content.encrypted) {
          setShowImportPassword(true);
          toast.info('This backup is encrypted. Please enter the password.');
        } else {
          // Directly import if not encrypted
          handleImport(file);
        }
      } catch (error) {
        toast.error('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async (file?: File, password?: string) => {
    if (!userId) {
      toast.error('You must be logged in to import data');
      return;
    }

    const fileToImport = file || selectedFile;
    if (!fileToImport) return;

    setIsImporting(true);
    try {
      await backupService.importData(
        fileToImport,
        userId,
        password || importPassword || undefined
      );
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      setImportPassword('');
      setShowImportPassword(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = async () => {
    if (!userId) return;

    try {
      await backupService.clearAllData(userId);
      setShowClearDialog(false);

      // Clear last backup date
      localStorage.removeItem(`lastBackup_${userId}`);
      setLastBackupDate(null);

      // Reload page after clearing
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Clear data error:', error);
      toast.error('Failed to clear data');
    }
  };

  return (
    <FadeIn duration={0.5} delay={0.2}>
      <Card className='p-8 bg-card border-card-border'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div>
              <h2 className='text-2xl font-bold flex items-center gap-3'>
                <Icon name={"database" as any} className='w-7 h-7 text-primary' />
                Backup & Restore
              </h2>
              <p className='text-muted-foreground mt-2'>
                Safeguard your data with regular backups
              </p>
            </div>
            {lastBackupDate && (
              <div className='text-sm text-muted-foreground text-right'>
                <p>Last backup</p>
                <p className='font-medium'>{lastBackupDate}</p>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className='space-y-4 p-6 bg-muted/20 rounded-lg border border-muted/30'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                <Icon name={"download" as any} className='w-6 h-6 text-primary' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold mb-2'>Export Your Data</h3>
                <p className='text-sm text-muted-foreground mb-4'>
                  Download a complete backup of all your data including
                  documents, settings, and preferences. You can optionally
                  encrypt your backup with a password for enhanced security.
                </p>
                {backupSize && (
                  <p className='text-xs text-muted-foreground mb-4'>
                    Estimated backup size:{' '}
                    <span className='font-medium'>{backupSize}</span>
                  </p>
                )}

                {/* Encryption Options */}
                <div className='space-y-4 mb-4 p-4 bg-muted/10 rounded-lg border border-muted/20'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='encrypt-backup'
                      checked={encryptBackup}
                      onCheckedChange={checked =>
                        setEncryptBackup(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor='encrypt-backup'
                      className='text-sm font-medium'
                    >
                      Encrypt backup with password
                    </Label>
                  </div>

                  {encryptBackup && (
                    <div className='space-y-2'>
                      <Label htmlFor='export-password' className='text-sm'>
                        Backup Password
                      </Label>
                      <div className='relative'>
                        <Input
                          id='export-password'
                          type={showExportPassword ? 'text' : 'password'}
                          value={exportPassword}
                          onChange={e => setExportPassword(e.target.value)}
                          placeholder='Enter a strong password'
                          className='pr-10'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowExportPassword(!showExportPassword)
                          }
                          className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                        >
                          <Icon
                            name={showExportPassword ? 'eye-off' : 'eye'}
                            className='w-4 h-4'
                          />
                        </button>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        ⚠️ Remember this password! You'll need it to restore
                        your backup.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleExport}
                  disabled={isExporting || isImporting}
                  className='bg-primary hover:bg-primary-hover'
                >
                  {isExporting ? (
                    <>
                      <Icon name={"upload" as any}
                        className='w-4 h-4 mr-2 animate-pulse'
                      />
                      Preparing Export...
                    </>
                  ) : (
                    <>
                      <Icon name={"download" as any} className='w-4 h-4 mr-2' />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div className='space-y-4 p-6 bg-muted/20 rounded-lg border border-muted/30'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0'>
                <Icon name={"upload" as any} className='w-6 h-6 text-blue-600' />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold mb-2'>Restore From Backup</h3>
                <p className='text-sm text-muted-foreground mb-4'>
                  Restore your data from a previously exported backup file. This
                  will merge the backup data with your existing data, avoiding
                  duplicates where possible.
                </p>
                {/* Password input for encrypted backups */}
                {showImportPassword && (
                  <div className='space-y-4 mb-4 p-4 bg-muted/10 rounded-lg border border-muted/20'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='import-password'
                        className='text-sm font-medium'
                      >
                        Backup Password Required
                      </Label>
                      <div className='relative'>
                        <Input
                          id='import-password'
                          type='password'
                          value={importPassword}
                          onChange={e => setImportPassword(e.target.value)}
                          placeholder='Enter backup password'
                          className='pr-10'
                          onKeyDown={e => {
                            if (e.key === 'Enter' && importPassword) {
                              handleImport(undefined, importPassword);
                            }
                          }}
                        />
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          onClick={() =>
                            handleImport(undefined, importPassword)
                          }
                          disabled={!importPassword || isImporting}
                        >
                          <Icon name={"unlock" as any} className='w-4 h-4 mr-2' />
                          Decrypt & Import
                        </Button>
                        <Button
                          size='sm'
                          variant={"outline" as any}
                          onClick={() => {
                            setShowImportPassword(false);
                            setImportPassword('');
                            setSelectedFile(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-3'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='.json'
                    onChange={handleFileSelect}
                    disabled={isExporting || isImporting}
                    className='hidden'
                    id='backup-file-input'
                  />
                  <label htmlFor='backup-file-input'>
                    <Button
                      asChild
                      variant={"outline" as any}
                      disabled={isExporting || isImporting}
                    >
                      <span>
                        {isImporting ? (
                          <>
                            <Icon name={"upload" as any}
                              className='w-4 h-4 mr-2 animate-pulse'
                            />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Icon name={"upload" as any} className='w-4 h-4 mr-2' />
                            Choose Backup File
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                  <span className='text-xs text-muted-foreground'>
                    Max file size: 10MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4'>
            <div className='flex gap-3'>
              <Icon name={"info" as any}
                className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5'
              />
              <div className='text-sm space-y-2'>
                <p className='font-medium text-blue-900 dark:text-blue-100'>
                  Important Information
                </p>
                <ul className='space-y-1 text-blue-800 dark:text-blue-200'>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>•</span>
                    <span>
                      Backups contain sensitive data. Store them securely and
                      never share them publicly.
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>•</span>
                    <span>
                      Regular backups are recommended, especially before major
                      changes.
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-blue-600 mt-1'>•</span>
                    <span>
                      Imported data will be merged with existing data to avoid
                      duplicates.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className='border-t border-card-border pt-6'>
            <h3 className='text-lg font-semibold mb-4 text-status-error'>
              Danger Zone
            </h3>
            <div className='p-4 border-2 border-status-error/20 rounded-lg bg-status-error/5'>
              <div className='flex items-start gap-4'>
                <Icon name={"triangle-exclamation" as any}
                  className='w-6 h-6 text-status-error flex-shrink-0 mt-1'
                />
                <div className='flex-1'>
                  <h4 className='font-medium mb-2'>Clear All Data</h4>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Permanently delete all your local data. This action cannot
                    be undone. Make sure you have a backup before proceeding.
                  </p>
                  <Button
                    variant={"destructive" as any}
                    onClick={() => setShowClearDialog(true)}
                    disabled={isExporting || isImporting}
                  >
                    <Icon name={"trash" as any} className='w-4 h-4 mr-2' />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Data Confirmation Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <Icon name={"triangle-exclamation" as any}
                  className='w-5 h-5 text-status-error'
                />
                Clear All Data?
              </AlertDialogTitle>
              <AlertDialogDescription className='space-y-3'>
                <p>
                  This will permanently delete ALL your local data including:
                </p>
                <ul className='list-disc list-inside space-y-1 text-sm'>
                  <li>Documents and files metadata</li>
                  <li>Personal information and settings</li>
                  <li>Saved preferences and progress</li>
                </ul>
                <p className='font-medium text-status-error'>
                  This action cannot be undone!
                </p>
                <p>Make sure you have exported a backup before proceeding.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearData}
                className='bg-status-error hover:bg-status-error/90'
              >
                Yes, Clear All Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </FadeIn>
  );
}
