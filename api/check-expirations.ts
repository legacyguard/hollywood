import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize clients with secret keys from server environment
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

interface DocumentWithUser {
  id: string;
  file_name: string;
  expires_at: string;
  document_type: string;
  user_email: string;
  user_name?: string;
}

function calculateDaysUntilExpiration(expiresAt: string): number {
  const today = new Date();
  const expirationDate = new Date(expiresAt);
  const diffTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getEmailTemplate(document: DocumentWithUser, daysUntil: number): { subject: string; html: string } {
  const userName = document.user_name || 'Dear Guardian of Memories';
  
  let urgencyMessage = '';
  let emoji = '🔔';
  
  if (daysUntil <= 1) {
    urgencyMessage = 'expires tomorrow';
    emoji = '🚨';
  } else if (daysUntil <= 7) {
    urgencyMessage = `expires in ${daysUntil} days`;
    emoji = '⏰';
  } else {
    urgencyMessage = `expires in ${daysUntil} days`;
    emoji = '📅';
  }

  return {
    subject: `${emoji} Gentle reminder: Your document ${urgencyMessage}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document Expiration Reminder</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 32px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 28px;">${emoji}</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">LegacyGuard Reminder</h1>
              <p style="margin: 8px 0 0; opacity: 0.9;">Your trusted guardian watching over your documents</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 24px; font-size: 16px;">Hello ${userName},</p>
              
              <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; border-radius: 6px; margin: 24px 0;">
                <p style="margin: 0; font-weight: 600; color: #1e293b;">Document Expiring Soon</p>
                <p style="margin: 8px 0 0; color: #475569;">
                  <strong>${document.file_name}</strong><br>
                  <span style="font-size: 14px;">Type: ${document.document_type || 'Document'}</span><br>
                  <span style="font-size: 14px; color: ${daysUntil <= 7 ? '#dc2626' : '#059669'};">
                    ${urgencyMessage.charAt(0).toUpperCase() + urgencyMessage.slice(1)}
                  </span>
                </p>
              </div>
              
              <p style="margin: 24px 0;">
                I noticed that the expiration date for this important document is approaching. 
                ${daysUntil <= 7 
                  ? 'This is quite urgent, so you might want to take action soon.' 
                  : 'No rush, just a friendly reminder so you don\'t forget.'
                }
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.VITE_APP_URL || 'https://legacyguard.vercel.app'}/vault" 
                   style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; transition: background-color 0.2s;">
                  View in My Vault
                </a>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  With care and attention,<br>
                  <strong>Sofia</strong><br>
                  <span style="font-style: italic;">Your LegacyGuard Assistant</span>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                This is an automated reminder from LegacyGuard to help you stay organized.<br>
                <a href="${process.env.VITE_APP_URL || 'https://legacyguard.vercel.app'}/settings" 
                   style="color: #6366f1; text-decoration: none;">Manage notification preferences</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security check - ensure only Vercel cron can trigger this
  const cronSecret = req.headers['x-vercel-cron-secret'];
  if (cronSecret !== process.env.VERCEL_CRON_SECRET) {
    console.error('Unauthorized cron attempt');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    // Calculate target dates for notifications (30, 7, and 1 day before expiration)
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    const oneDayFromNow = new Date(today);
    oneDayFromNow.setDate(today.getDate() + 1);

    // Find documents that expire exactly on these dates
    const targetDates = [
      thirtyDaysFromNow.toISOString().split('T')[0],
      sevenDaysFromNow.toISOString().split('T')[0],
      oneDayFromNow.toISOString().split('T')[0]
    ];

    console.log('Checking for documents expiring on:', targetDates);

    // Query documents with expiration dates matching our targets
    // Note: We need to join with user profiles to get email addresses
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        file_name,
        expires_at,
        document_type,
        user_id
      `)
      .not('expires_at', 'is', null)
      .gte('expires_at', today.toISOString())
      .lte('expires_at', thirtyDaysFromNow.toISOString());

    if (error) {
      console.error('Error querying documents:', error);
      throw error;
    }

    if (!documents || documents.length === 0) {
      console.log('No expiring documents found');
      return res.status(200).json({ message: 'No expiring documents found' });
    }

    // Get user information for email sending
    const userIds = [...new Set(documents.map(doc => doc.user_id))];
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    if (usersError) {
      console.error('Error querying users:', usersError);
      // Try to get user emails from Clerk/auth if profiles table doesn't exist
    }

    let emailsSent = 0;
    const errors: string[] = [];

    for (const doc of documents) {
      try {
        const daysUntil = calculateDaysUntilExpiration(doc.expires_at);
        
        // Only send notifications for 30, 7, and 1 day thresholds
        if (![30, 7, 1].includes(daysUntil)) {
          continue;
        }

        // Find user email
        const user = users?.find(u => u.id === doc.user_id);
        if (!user?.email) {
          console.warn(`No email found for user ${doc.user_id}`);
          continue;
        }

        const documentWithUser: DocumentWithUser = {
          ...doc,
          user_email: user.email,
          user_name: user.full_name || undefined
        };

        const { subject, html } = getEmailTemplate(documentWithUser, daysUntil);

        await resend.emails.send({
          from: 'Sofia from LegacyGuard <sofia@legacyguard.app>',
          to: user.email,
          subject,
          html
        });

        emailsSent++;
        console.log(`Notification sent for document ${doc.file_name} to ${user.email} (${daysUntil} days until expiration)`);

      } catch (emailError) {
        console.error(`Failed to send email for document ${doc.id}:`, emailError);
        errors.push(`Failed to notify about ${doc.file_name}: ${emailError}`);
      }
    }

    const response = {
      message: `Notification check completed. Sent ${emailsSent} notifications.`,
      documentsChecked: documents.length,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('Notification job completed:', response);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in notification job:', error);
    return res.status(500).json({ 
      message: 'Failed to check document expirations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}