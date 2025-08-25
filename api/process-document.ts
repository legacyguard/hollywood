import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { createClerkClient } from '@clerk/backend';
import type {
  ProcessedDocument,
  OCRProcessingConfig,
  OCRProcessingResponse,
  DocumentClassification,
  DocumentMetadata,
  ExtractedEntity,
  DocumentType
} from '../src/types/ocr';
import {
  DOCUMENT_PATTERNS
} from '../src/types/ocr';

function getAllowedOrigin(origin?: string | null): string {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const list = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (origin && list.includes(origin)) return origin;
  return list[0] || 'http://localhost:8080';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
// Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const origin = (req.headers.origin as string) || undefined;
    res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    const origin = (req.headers.origin as string) || undefined;
    res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(405).json({
      error: 'Method not allowed',
      success: false
    });
  }

  try {
// Auth: require valid Clerk token
    const authHeader = (req.headers.authorization as string) || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    try {
      if (!token) throw new Error('Missing token');
      await clerk.verifyToken(token);
    } catch {
      const origin = (req.headers.origin as string) || undefined;
      res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Validate required environment variables
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID ||
        !process.env.GOOGLE_CLOUD_CLIENT_EMAIL ||
        !process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Cloud credentials not properly configured',
        processingId: 'config_error'
      });
    }

    // Initialize Google Cloud Vision client
    const client = new ImageAnnotatorClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_id: process.env.GOOGLE_CLOUD_CLIENT_ID,
        private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
      },
    });

const { fileData, fileName, config } = req.body as {
      fileData: string;
      fileName: string;
      config: OCRProcessingConfig;
    };

    // Enforce size limit ~10MB on base64 payload
    if (fileData) {
      const approxBytes = Math.floor((fileData.length * 3) / 4); // base64 estimate
      if (approxBytes > 10 * 1024 * 1024) {
        const origin = (req.headers.origin as string) || undefined;
        res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(413).json({ success: false, error: 'Payload too large' });
      }
    }

    if (!fileData || !fileName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fileData and fileName'
      });
    }

    const processingId = `ocr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const startTime = Date.now();

    try {
      // Step 1: Perform OCR using Google Cloud Vision
      const [result] = await client.documentTextDetection({
        image: {
          content: Buffer.from(fileData, 'base64'),
        },
      });

      const detections = result.textAnnotations;
      const fullTextAnnotation = result.fullTextAnnotation;

      if (!detections || detections.length === 0) {
        throw new Error('No text detected in the image');
      }

      // Extract full text
      const fullText = fullTextAnnotation?.text || detections[0]?.description || '';
      const processingTime = Date.now() - startTime;

      // Step 2: Extract entities
      const extractedEntities: ExtractedEntity[] = config.enableEntityExtraction
        ? extractEntities(fullText)
        : [];

      // Step 3: Classify document
      const classification: DocumentClassification = config.enableDocumentClassification
        ? classifyDocument(fullText, extractedEntities)
        : {
            category: 'other',
            type: 'other',
            confidence: 0,
            reasons: ['Classification disabled'],
            suggestedTags: []
          };

      // Step 4: Extract metadata
      const extractedMetadata: DocumentMetadata = config.enableMetadataExtraction
        ? extractMetadata(fullText, classification.type, extractedEntities)
        : {};

      // Step 5: Create processed document
      const processedDocument: ProcessedDocument = {
        id: processingId,
        originalFileName: fileName,
        ocrResult: {
          text: fullText,
          confidence: calculateConfidence(detections),
          boundingBoxes: extractBoundingBoxes(detections),
          detectedLanguage: detections[0]?.locale || 'en',
          metadata: {
            processingTime,
            imageSize: {
              width: fullTextAnnotation?.pages?.[0]?.width || 0,
              height: fullTextAnnotation?.pages?.[0]?.height || 0
            },
            textBlocks: extractTextBlocks(fullTextAnnotation),
            extractedEntities
          }
        },
        classification,
        extractedMetadata,
        processingStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response: OCRProcessingResponse = {
        success: true,
        processedDocument,
        processingId
      };

const origin = (req.headers.origin as string) || undefined;
      res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      return res.status(200).json(response);

    } catch (visionError) {
      console.error('Google Vision API error:', visionError);

      const errorResponse: OCRProcessingResponse = {
        success: false,
        error: `OCR processing failed: ${visionError instanceof Error ? visionError.message : 'Unknown error'}`,
        processingId
      };

      const origin = (req.headers.origin as string) || undefined;
      res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      return res.status(500).json(errorResponse);
    }

  } catch (error) {
    console.error('API handler error:', error);

    const errorResponse: OCRProcessingResponse = {
      success: false,
      error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      processingId: `error_${Date.now()}`
    };

    const origin = (req.headers.origin as string) || undefined;
    res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    return res.status(500).json(errorResponse);
  }
}

// Helper functions
function extractEntities(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];

  // Email pattern
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailPattern) || [];
  emails.forEach(email => {
    entities.push({
      type: 'email',
      value: email,
      confidence: 0.9
    });
  });

  // Phone pattern
  const phonePattern = /(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g;
  const phones = text.match(phonePattern) || [];
  phones.forEach(phone => {
    entities.push({
      type: 'phone',
      value: phone,
      confidence: 0.85
    });
  });

  // Date patterns
  const datePatterns = [
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,
    /\b[A-Za-z]+ \d{1,2},? \d{4}\b/g
  ];

  datePatterns.forEach(pattern => {
    const dates = text.match(pattern) || [];
    dates.forEach(date => {
      entities.push({
        type: 'date',
        value: date,
        confidence: 0.8
      });
    });
  });

  // SSN pattern
  const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = text.match(ssnPattern) || [];
  ssns.forEach(ssn => {
    entities.push({
      type: 'ssn',
      value: ssn,
      confidence: 0.9
    });
  });

  // Amount pattern
  const amountPattern = /\$[\d,]+\.?\d*/g;
  const amounts = text.match(amountPattern) || [];
  amounts.forEach(amount => {
    entities.push({
      type: 'amount',
      value: amount,
      confidence: 0.7
    });
  });

  return entities;
}

function classifyDocument(text: string, entities: ExtractedEntity[]): DocumentClassification {
  const textLower = text.toLowerCase();
  const scores: Record<string, number> = {};

  // Score each document type
  Object.entries(DOCUMENT_PATTERNS).forEach(([type, pattern]) => {
    let score = 0;

    // Keyword matching
    pattern.keywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (keywordRegex.test(text)) {
        score += 10;
      }
    });

    // Pattern matching
    pattern.patterns.forEach(regex => {
      if (regex.test(text)) {
        score += 15;
      }
    });

    // Required entities bonus
    if (pattern.requiredEntities) {
      const foundEntities = pattern.requiredEntities.filter(entityType =>
        entities.some(entity => entity.type === entityType)
      );
      score += foundEntities.length * 5;
    }

    scores[type] = score;
  });

  // Find best match
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0);

  if (sortedScores.length === 0) {
    return {
      category: 'other',
      type: 'other',
      confidence: 0,
      reasons: ['No matching patterns found'],
      suggestedTags: generateSuggestedTags(text)
    };
  }

  const [bestType, bestScore] = sortedScores[0];
  const confidence = Math.min(bestScore / 50, 1);

  const pattern = DOCUMENT_PATTERNS[bestType as DocumentType];
  const reasons = [
    `Matched ${pattern.keywords.length} keywords`,
    `Matched ${pattern.patterns.length} patterns`,
    `Found ${entities.length} relevant entities`
  ].filter(reason => !reason.includes('0'));

  return {
    category: pattern.category,
    type: bestType as DocumentType,
    confidence,
    reasons,
    suggestedTags: generateSuggestedTags(text)
  };
}

function extractMetadata(
  text: string,
  docType: DocumentType,
  entities: ExtractedEntity[]
): DocumentMetadata {
  const metadata: DocumentMetadata = {};

  // Extract common metadata
  const dateEntities = entities.filter(e => e.type === 'date');
  if (dateEntities.length > 0) {
    metadata.date = dateEntities[0].value;
  }

  const amountEntities = entities.filter(e => e.type === 'amount');
  if (amountEntities.length > 0) {
    metadata.amount = amountEntities[0].value;
  }

  // Document-specific metadata extraction
  switch (docType) {
    case 'bank_statement':
      // Extract account number
      const accountPattern = /(?:account|acct)[\s#:]*([0-9-]{8,20})/gi;
      const accountMatch = text.match(accountPattern);
      if (accountMatch) {
        metadata.accountNumber = accountMatch[0];
      }
      break;

    case 'life_insurance':
    case 'auto_insurance':
    case 'home_insurance':
      // Extract policy number
      const policyPattern = /policy\s*(?:number|#)?:?\s*([A-Z0-9-]+)/i;
      const policyMatch = text.match(policyPattern);
      if (policyMatch) {
        metadata.policyNumber = policyMatch[1];
      }
      break;
  }

  return metadata;
}

function generateSuggestedTags(text: string): string[] {
  const tags: string[] = [];
  const textLower = text.toLowerCase();

  const tagPatterns = {
    'important': /important|urgent|critical|priority/i,
    'expires': /expir|due|deadline|valid until/i,
    'legal': /legal|attorney|court|law/i,
    'financial': /financial|money|payment|account|loan/i,
    'medical': /medical|health|doctor|hospital/i,
    'insurance': /insurance|policy|coverage|premium/i,
    'tax': /tax|irs|revenue|deduction/i,
    'personal': /personal|private|confidential/i
  };

  Object.entries(tagPatterns).forEach(([tag, pattern]) => {
    if (pattern.test(text)) {
      tags.push(tag);
    }
  });

  return tags.slice(0, 5);
}

function calculateConfidence(detections: any[]): number {
  if (!detections || detections.length === 0) return 0;
  // Simple confidence calculation - in reality, this would be more sophisticated
  return 0.85;
}

function extractBoundingBoxes(detections: any[]) {
  return detections.slice(1).map(detection => {
    const vertices = detection.boundingPoly?.vertices || [];
    if (vertices.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    const xs = vertices.map((v: any) => v.x || 0);
    const ys = vertices.map((v: any) => v.y || 0);

    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys)
    };
  });
}

function extractTextBlocks(fullTextAnnotation: any) {
  const textBlocks: any[] = [];

  if (fullTextAnnotation?.pages) {
    fullTextAnnotation.pages.forEach((page: any) => {
      page.blocks?.forEach((block: any) => {
        block.paragraphs?.forEach((paragraph: any) => {
          let text = '';
          paragraph.words?.forEach((word: any) => {
            word.symbols?.forEach((symbol: any) => {
              text += symbol.text;
            });
            text += ' ';
          });

          if (text.trim()) {
            textBlocks.push({
              text: text.trim(),
              confidence: paragraph.confidence || 0.8,
              boundingBox: extractBoundingBoxFromVertices(paragraph.boundingBox?.vertices || []),
              type: 'paragraph'
            });
          }
        });
      });
    });
  }

  return textBlocks;
}

function extractBoundingBoxFromVertices(vertices: any[]) {
  if (vertices.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  const xs = vertices.map(v => v.x || 0);
  const ys = vertices.map(v => v.y || 0);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
}
