import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClerkClient } from '@clerk/backend';

function getAllowedOrigin(origin?: string | null): string {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const list = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (origin && list.includes(origin)) return origin;
  return list[0] || 'http://localhost:8082';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
// Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const origin = (req.headers.origin as string) || undefined;
    return res
      .status(200)
      .setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin))
      .json({ message: 'OK' });
  }

if (req.method !== 'POST') {
    const origin = (req.headers.origin as string) || undefined;
    return res.status(405).setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin)).json({ 
      error: 'Method not allowed',
      success: false 
    });
  }

  try {
// Auth: require valid Clerk token
    const authHeader = (req.headers.authorization as string) || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const origin = (req.headers.origin as string) || undefined;
    try {
      if (!token) throw new Error('Missing token');
      await clerk.verifyToken(token);
    } catch {
      res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Validate required environment variables
    if (!process.env.VITE_SUPABASE_URL) {
      return res.status(500).setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin)).json({
        success: false,
        error: 'Supabase configuration not found'
      });
    }

    const { fileData, fileName, fileType } = req.body;

if (!fileData || !fileName) {
      return res
        .status(400)
        .setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin))
        .json({
          success: false,
          error: 'Missing required fields: fileData and fileName'
        });
    }

// Forward the request to Supabase Edge Function, preserving user Authorization header
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/intelligent-document-analyzer`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        fileData,
        fileName,
        fileType
      })
    });

    const result = await response.json();
    
    // Set CORS headers and forward the response
const origin = (req.headers.origin as string) || undefined;
    res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (!response.ok) {
      return res.status(response.status).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('API proxy error:', error);
    
    const origin = (req.headers.origin as string) || undefined;
    res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(origin));
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    return res.status(500).json({
      success: false,
      error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}