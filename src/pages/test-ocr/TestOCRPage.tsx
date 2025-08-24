import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OCRService } from '@/services/ocrService';
import { DocumentType } from '@/types/ocr';

const TestOCRPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const ocrService = new OCRService();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setProcessing(true);
    setError('');
    
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64String = result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Process with OCR
      const ocrResult = await ocrService.processDocument(base64, file.type);
      setResult(ocrResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
      console.error('OCR Error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    const labels: Record<DocumentType, string> = {
      [DocumentType.PASSPORT]: 'Passport',
      [DocumentType.ID_CARD]: 'ID Card',
      [DocumentType.DRIVERS_LICENSE]: 'Driver\'s License',
      [DocumentType.BIRTH_CERTIFICATE]: 'Birth Certificate',
      [DocumentType.MARRIAGE_CERTIFICATE]: 'Marriage Certificate',
      [DocumentType.INSURANCE_POLICY]: 'Insurance Policy',
      [DocumentType.BANK_STATEMENT]: 'Bank Statement',
      [DocumentType.TAX_DOCUMENT]: 'Tax Document',
      [DocumentType.MEDICAL_RECORD]: 'Medical Record',
      [DocumentType.PROPERTY_DEED]: 'Property Deed',
      [DocumentType.WILL]: 'Will',
      [DocumentType.CONTRACT]: 'Contract',
      [DocumentType.INVOICE]: 'Invoice',
      [DocumentType.RECEIPT]: 'Receipt',
      [DocumentType.CERTIFICATE]: 'Certificate',
      [DocumentType.LETTER]: 'Letter',
      [DocumentType.REPORT]: 'Report',
      [DocumentType.OTHER]: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">OCR Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB
                  </span>
                </label>
              </div>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Document preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              )}

              <Button
                onClick={handleProcess}
                disabled={!file || processing}
                className="w-full"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Process Document
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>OCR Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Document Type */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-1">
                    Document Type
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {getDocumentTypeLabel(result.classification.documentType)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(result.classification.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>

                {/* Extracted Text */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-1">
                    Extracted Text
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {result.text || 'No text detected'}
                    </pre>
                  </div>
                </div>

                {/* Extracted Entities */}
                {result.entities && Object.keys(result.entities).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">
                      Extracted Information
                    </h3>
                    <div className="space-y-2">
                      {result.entities.names?.length > 0 && (
                        <div className="flex">
                          <span className="text-sm font-medium w-24">Names:</span>
                          <span className="text-sm">
                            {result.entities.names.join(', ')}
                          </span>
                        </div>
                      )}
                      {result.entities.dates?.length > 0 && (
                        <div className="flex">
                          <span className="text-sm font-medium w-24">Dates:</span>
                          <span className="text-sm">
                            {result.entities.dates.join(', ')}
                          </span>
                        </div>
                      )}
                      {result.entities.amounts?.length > 0 && (
                        <div className="flex">
                          <span className="text-sm font-medium w-24">Amounts:</span>
                          <span className="text-sm">
                            {result.entities.amounts.join(', ')}
                          </span>
                        </div>
                      )}
                      {result.entities.addresses?.length > 0 && (
                        <div className="flex">
                          <span className="text-sm font-medium w-24">Addresses:</span>
                          <span className="text-sm">
                            {result.entities.addresses.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-1">
                    Processing Details
                  </h3>
                  <div className="text-xs space-y-1 text-gray-500">
                    <div>Processed at: {new Date(result.timestamp).toLocaleString()}</div>
                    <div>Language: {result.language || 'Unknown'}</div>
                    <div>Words detected: {result.text?.split(' ').length || 0}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Upload and process a document to see OCR results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Google Cloud Vision API Status</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>✅ API Enabled and Billing Active</li>
                <li>Project: splendid-light-216311</li>
                <li>Free tier: 1,000 requests/month</li>
                <li>
                  Monitor usage at{' '}
                  <a
                    href="https://console.cloud.google.com/apis/api/vision.googleapis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestOCRPage;
