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
  user_id: string;
  user_email: string;
  user_name?: string;
  last_notification_sent_at?: string | null;
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
    
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    console.log('Checking for documents expiring between:', today.toISOString(), 'and', thirtyDaysFromNow.toISOString());

    // Query documents that expire in the next 30 days and haven't been notified recently
    // Use range query instead of exact date matching
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        file_name,
        expires_at,
        document_type,
        user_id,
        last_notification_sent_at
      `)
      .not('expires_at', 'is', null)
      .gte('expires_at', today.toISOString()) // Greater than or equal to today
      .lte('expires_at', thirtyDaysFromNow.toISOString()) // Less than or equal to 30 days from now
      .or(`last_notification_sent_at.is.null,last_notification_sent_at.lt.${new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()}`) // No notification sent OR last notification was more than 20 days ago

    if (error) {
      console.error('Error querying documents:', error);
      throw error;
    }

    if (!documents || documents.length === 0) {
      console.log('No documents needing notifications found');
      return res.status(200).json({ message: 'No documents needing notifications found' });
    }

    console.log(`Found ${documents.length} documents that may need notifications`);

    // Get user information for email sending
    const userIds = [...new Set(documents.map(doc => doc.user_id))];
    
    let users: { id: string; email: string; full_name?: string }[] = [];
    
    // Try to get user emails from profiles table
    const { data: profilesData, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    if (usersError) {
      console.warn('Error querying profiles table:', usersError);
      console.log('Attempting to get user emails from auth.users table');
      
      // Fallback to auth.users table if profiles doesn't exist or fails
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsersData?.users) {
        users = authUsersData.users
          .filter(user => userIds.includes(user.id))
          .map(user => ({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name
          }))
          .filter(user => user.email); // Only include users with valid emails
      } else {
        console.error('Failed to get user emails from both profiles and auth tables');
      }
    } else {
      users = profilesData || [];
    }

    let emailsSent = 0;
    let documentsProcessed = 0;
    const errors: string[] = [];
    const updatedDocuments: string[] = [];

    for (const doc of documents) {
      try {
        documentsProcessed++;
        const daysUntil = calculateDaysUntilExpiration(doc.expires_at);
        
        console.log(`Processing document ${doc.file_name}: ${daysUntil} days until expiration`);
        
        // Only send notifications for specific thresholds: 30, 7, and 1 day
        // Allow some flexibility (±1 day) to account for timing variations
        const shouldNotify = (
          (daysUntil >= 29 && daysUntil <= 31) || // ~30 days
          (daysUntil >= 6 && daysUntil <= 8) ||   // ~7 days  
          (daysUntil >= 0 && daysUntil <= 2)      // ~1 day
        );
        
        if (!shouldNotify) {
          console.log(`Skipping notification for ${doc.file_name} - not at threshold (${daysUntil} days)`);
          continue;
        }

        // Find user email - improved error handling
        const user = users.find(u => u.id === doc.user_id);
        if (!user) {
          console.warn(`No user found for user_id: ${doc.user_id}`);
          errors.push(`No user record found for document: ${doc.file_name}`);
          continue;
        }

        if (!user.email) {
          console.warn(`User ${doc.user_id} has no email address`);
          errors.push(`No email address for user with document: ${doc.file_name}`);
          continue;
        }

        const documentWithUser: DocumentWithUser = {
          ...doc,
          user_email: user.email,
          user_name: user.full_name || undefined
        };

        // Determine the appropriate urgency level for email
        let emailDaysUntil: number;
        if (daysUntil >= 29 && daysUntil <= 31) emailDaysUntil = 30;
        else if (daysUntil >= 6 && daysUntil <= 8) emailDaysUntil = 7;
        else emailDaysUntil = 1;

        const { subject, html } = getEmailTemplate(documentWithUser, emailDaysUntil);

        // Send the email
        await resend.emails.send({
          from: 'Sofia from LegacyGuard <sofia@legacyguard.app>',
          to: user.email,
          subject,
          html
        });

        // Update the last_notification_sent_at timestamp
        const { error: updateError } = await supabase
          .from('documents')
          .update({ last_notification_sent_at: new Date().toISOString() })
          .eq('id', doc.id);

        if (updateError) {
          console.warn(`Failed to update notification timestamp for document ${doc.id}:`, updateError);
          // Continue anyway - email was sent successfully
        } else {
          updatedDocuments.push(doc.id);
        }

        emailsSent++;
        console.log(`✅ Notification sent for document "${doc.file_name}" to ${user.email} (${daysUntil} days until expiration)`);

      } catch (emailError) {
        console.error(`❌ Failed to send email for document ${doc.id}:`, emailError);
        errors.push(`Failed to notify about ${doc.file_name}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      }
    }

    const response = {
      message: `Notification check completed. Sent ${emailsSent} notifications.`,
      documentsInRange: documents.length,
      documentsProcessed,
      emailsSent,
      documentsUpdated: updatedDocuments.length,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        totalCandidates: documents.length,
        processedCount: documentsProcessed,
        emailsSentCount: emailsSent,
        timestampsUpdated: updatedDocuments.length,
        errorsCount: errors.length
      }
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