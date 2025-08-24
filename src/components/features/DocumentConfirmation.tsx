"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon-library';
import { FadeIn } from '@/components/motion/FadeIn';
import { cn } from '@/lib/utils';

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

interface DocumentConfirmationProps {
  file: File;
  analysisResult: DocumentAnalysisResult;
  onConfirm: (confirmedData: DocumentAnalysisResult) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const DocumentConfirmation: React.FC<DocumentConfirmationProps> = ({
  file,
  analysisResult,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  const [editableData, setEditableData] = useState(analysisResult);
  
  const handleCategoryChange = (newCategory: string) => {
    setEditableData(prev => ({
      ...prev,
      suggestedCategory: {
        ...prev.suggestedCategory,
        category: newCategory
      }
    }));
  };

  const handleTitleChange = (newTitle: string) => {
    setEditableData(prev => ({
      ...prev,
      suggestedTitle: {
        ...prev.suggestedTitle,
        title: newTitle
      }
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-status-success';
    if (confidence >= 0.6) return 'text-status-warning';
    return 'text-status-error';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return 'check-circle';
    if (confidence >= 0.6) return 'alert-triangle';
    return 'x-circle';
  };

  const categories = [
    { id: 'personal', label: 'Personal', icon: 'user' },
    { id: 'housing', label: 'Housing', icon: 'home' },
    { id: 'finances', label: 'Finances', icon: 'dollar-sign' },
    { id: 'work', label: 'Work', icon: 'briefcase' },
    { id: 'health', label: 'Health', icon: 'heart' },
    { id: 'legal', label: 'Legal', icon: 'scale' },
    { id: 'vehicles', label: 'Vehicles', icon: 'car' },
    { id: 'insurance', label: 'Insurance', icon: 'shield' },
    { id: 'other', label: 'Other', icon: 'file' }
  ];

  return (
    <FadeIn duration={0.5}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Document Preview */}
        <Card className="p-6 bg-card border-card-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="documents" className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Document Preview</h3>
              <p className="text-sm text-muted-foreground">{file.name}</p>
            </div>
          </div>

          {/* File Info */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">File Size:</span>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">File Type:</span>
              <span>{file.type || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Time:</span>
              <span>{(analysisResult.processingTime / 1000).toFixed(2)}s</span>
            </div>
          </div>

          {/* Extracted Text Preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Extracted Text</span>
              <Badge variant="outline" className="text-xs">
                {(analysisResult.confidence * 100).toFixed(0)}% confidence
              </Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {analysisResult.extractedText.substring(0, 300)}
                {analysisResult.extractedText.length > 300 && '...'}
              </p>
            </div>
          </div>
        </Card>

        {/* Analysis Results */}
        <Card className="p-6 bg-card border-card-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="brain" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Analysis Results</h3>
              <p className="text-sm text-muted-foreground">
                Review and adjust the suggestions below
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Suggested Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Category</h4>
                <Icon 
                  name={getConfidenceIcon(editableData.suggestedCategory.confidence)}
                  className={cn("w-4 h-4", getConfidenceColor(editableData.suggestedCategory.confidence))}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={editableData.suggestedCategory.category === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.id)}
                    className="justify-start gap-2"
                  >
                    <Icon name={category.icon as keyof typeof import('@/components/ui/icon-library').IconMap} className="w-4 h-4" />
                    {category.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {editableData.suggestedCategory.reasoning}
              </p>
            </div>

            {/* Suggested Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Document Title</h4>
                <Icon 
                  name={getConfidenceIcon(editableData.suggestedTitle.confidence)}
                  className={cn("w-4 h-4", getConfidenceColor(editableData.suggestedTitle.confidence))}
                />
              </div>
              <input
                type="text"
                value={editableData.suggestedTitle.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Document title"
              />
              <p className="text-xs text-muted-foreground">
                {editableData.suggestedTitle.reasoning}
              </p>
            </div>

            {/* Expiration Date */}
            {editableData.expirationDate.date && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Expiration Date</h4>
                  <Icon 
                    name={getConfidenceIcon(editableData.expirationDate.confidence)}
                    className={cn("w-4 h-4", getConfidenceColor(editableData.expirationDate.confidence))}
                  />
                </div>
                <div className="flex items-center gap-2 p-2 bg-status-warning/10 rounded-md">
                  <Icon name="calendar" className="w-4 h-4 text-status-warning" />
                  <span className="text-sm">{editableData.expirationDate.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {editableData.expirationDate.reasoning}
                </p>
              </div>
            )}

            {/* Key Data */}
            {editableData.keyData.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Key Information</h4>
                <div className="space-y-2">
                  {editableData.keyData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium">{item.label}:</span>
                        <span className="text-sm">{item.value}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(item.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Tags */}
            {editableData.suggestedTags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Suggested Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {editableData.suggestedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              onClick={onCancel}
              variant="outline"
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(editableData)}
              disabled={isProcessing}
              className="flex-1 gap-2"
            >
              {isProcessing ? (
                <>
                  <Icon name="upload" className="w-4 h-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  Confirm & Save
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </FadeIn>
  );
};