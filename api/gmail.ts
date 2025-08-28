import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Validate environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('Missing required Google OAuth2 credentials');
}

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Initialize Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/**
 * Verify Clerk authentication token
 */
async function verifyAuth(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    const { verifyToken } = await import('@clerk/backend');
    const audience = process.env.CLERK_JWT_AUDIENCE;
    const authorizedParty = process.env.CLERK_FRONTEND_API;

    if (!audience || !authorizedParty) {
      throw new Error('Missing Clerk configuration');
    }

    const verificationResult = await verifyToken(token, {
      audience,
      authorizedParties: [authorizedParty]
    });

    return verificationResult.sub;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Store user's OAuth2 tokens securely (implement based on your storage solution)
 */
async function storeUserTokens(userId: string, tokens: any): Promise<void> {
  // TODO: Implement secure token storage
  // Options:
  // 1. Encrypted in database
  // 2. Secure key management service
  // 3. Encrypted cookies with httpOnly flag
  console.log('Storing tokens for user:', userId);
}

/**
 * Retrieve user's OAuth2 tokens
 */
async function getUserTokens(userId: string): Promise<any | null> {
  // TODO: Implement secure token retrieval
  console.log('Retrieving tokens for user:', userId);
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify authentication
    const userId = await verifyAuth(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { action } = req.query;

    switch (action) {
      case 'auth-url':
        // Generate OAuth2 authorization URL
        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify'
          ],
          state: userId, // Include user ID in state for correlation
          prompt: 'consent' // Force consent to ensure refresh token
        });

        return res.status(200).json({ authUrl });

      case 'callback':
        // Handle OAuth2 callback
        const { code, state } = req.body;

        if (!code) {
          return res.status(400).json({ error: 'Authorization code required' });
        }

        // Verify state matches user ID
        if (state !== userId) {
          return res.status(403).json({ error: 'State mismatch' });
        }

        try {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          // Store tokens securely
          await storeUserTokens(userId, tokens);

          return res.status(200).json({
            success: true,
            message: 'Gmail authorization successful'
          });
        } catch (error) {
          console.error('Token exchange failed:', error);
          return res.status(400).json({ error: 'Token exchange failed' });
        }

      case 'search':
        // Search emails
        const userTokens = await getUserTokens(userId);
        if (!userTokens) {
          return res.status(401).json({ error: 'Gmail not authorized' });
        }

        oauth2Client.setCredentials(userTokens);

        const { query, maxResults = 10 } = req.body;

        try {
          const response = await gmail.users.messages.list({
            userId: 'me',
            q: query,
            maxResults: Math.min(maxResults, 100) // Limit to 100
          });

          const messages = response.data.messages || [];

          // Fetch detailed message data
          const detailedMessages = await Promise.all(
            messages.slice(0, 10).map(async (msg) => {
              try {
                const detailed = await gmail.users.messages.get({
                  userId: 'me',
                  id: msg.id!
                });
                return detailed.data;
              } catch (error) {
                console.error(`Failed to fetch message ${msg.id}:`, error);
                return null;
              }
            })
          );

          return res.status(200).json({
            messages: detailedMessages.filter(Boolean)
          });
        } catch (error) {
          console.error('Email search failed:', error);
          return res.status(500).json({ error: 'Email search failed' });
        }

      case 'attachment':
        // Download attachment
        const attachmentTokens = await getUserTokens(userId);
        if (!attachmentTokens) {
          return res.status(401).json({ error: 'Gmail not authorized' });
        }

        oauth2Client.setCredentials(attachmentTokens);

        const { messageId, attachmentId } = req.body;

        if (!messageId || !attachmentId) {
          return res.status(400).json({ error: 'Message ID and attachment ID required' });
        }

        try {
          const attachment = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId,
            id: attachmentId
          });

          return res.status(200).json({
            data: attachment.data.data,
            size: attachment.data.size
          });
        } catch (error) {
          console.error('Attachment download failed:', error);
          return res.status(500).json({ error: 'Attachment download failed' });
        }

      case 'revoke':
        // Revoke Gmail authorization
        const revokeTokens = await getUserTokens(userId);
        if (revokeTokens) {
          try {
            await oauth2Client.revokeCredentials();
            // TODO: Remove tokens from storage
            return res.status(200).json({ success: true });
          } catch (error) {
            console.error('Token revocation failed:', error);
          }
        }
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Gmail API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
