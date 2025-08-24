import type { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:8082',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']).json({ 
      error: 'Method not allowed',
      success: false 
    });
  }

  try {
    // Validate required environment variables
    if (!process.env.VITE_SUPABASE_URL) {
      return res.status(500).setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']).json({
        success: false,
        error: 'Supabase configuration not found'
      });
    }

    const { fileData, fileName, fileType } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']).json({
        success: false,
        error: 'Missing required fields: fileData and fileName'
      });
    }

    // Forward the request to Supabase Edge Function
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/intelligent-document-analyzer`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // Use service role for server-to-server
      },
      body: JSON.stringify({
        fileData,
        fileName,
        fileType
      })
    });

    const result = await response.json();
    
    // Set CORS headers and forward the response
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (!response.ok) {
      return res.status(response.status).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('API proxy error:', error);
    
    res.setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    return res.status(500).json({
      success: false,
      error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}