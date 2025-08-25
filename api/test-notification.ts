import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { EmailColors, getUrgencyColor } from './email-colors';

// Initialize clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

interface TestNotificationRequest {
  email: string;
  documentName?: string;
  daysUntil?: number;
}

function getTestEmailTemplate(email: string, documentName = 'Test Document.pdf', daysUntil = 7): { subject: string; html: string } {
  const emoji = daysUntil <= 1 ? '🚨' : daysUntil <= 7 ? '⏰' : '📅';
  const urgencyMessage = daysUntil <= 1 ? 'expires tomorrow' : `expires in ${daysUntil} days`;

  return {
    subject: `${emoji} Test Notification: Your document ${urgencyMessage}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Notification from LegacyGuard</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: ${EmailColors.textMain}; background-color: ${EmailColors.background}; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: ${EmailColors.panelBackground}; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, ${EmailColors.brandStart} 0%, ${EmailColors.brandEnd} 100%); color: white; padding: 32px 24px; text-align: center;">
              <div style="width: 64px; height: 64px; background: ${EmailColors.translucentWhite20}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 28px;">🧪</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">LegacyGuard Test Notification</h1>
              <p style="margin: 8px 0 0; opacity: 0.9;">Testing the notification system</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              <div style="background: ${EmailColors.warningBackground}; border-left: 4px solid ${EmailColors.warningBorder}; padding: 16px; border-radius: 6px; margin: 0 0 24px;">
                <p style="margin: 0; font-weight: 600; color: ${EmailColors.warningText};">🧪 This is a test notification</p>
                <p style="margin: 8px 0 0; color: ${EmailColors.warningSubtext}; font-size: 14px;">
                  This email was sent to test the LegacyGuard notification system. In a real scenario, this would be triggered by an actual document expiration.
                </p>
              </div>
              
              <p style="margin: 0 0 24px; font-size: 16px;">Hello Guardian of Memories,</p>
              
              <div style="background: ${EmailColors.infoBackground}; border-left: 4px solid ${EmailColors.brandStart}; padding: 16px; border-radius: 6px; margin: 24px 0;">
                <p style="margin: 0; font-weight: 600; color: ${EmailColors.headlineText};">Simulated Document Expiring</p>
                <p style="margin: 8px 0 0; color: ${EmailColors.mutedText};">
                  <strong>${documentName}</strong><br>
                  <span style="font-size: 14px;">Type: Test Document</span><br>
                  <span style="font-size: 14px; color: ${getUrgencyColor(daysUntil)};">
                    ${urgencyMessage.charAt(0).toUpperCase() + urgencyMessage.slice(1)}
                  </span>
                </p>
              </div>
              
              <p style="margin: 24px 0;">
                This is what a real notification would look like when one of your important documents is approaching its expiration date.
                ${daysUntil <= 7 
                  ? 'In a real scenario, this would be quite urgent.' 
                  : 'In a real scenario, this would be a gentle early reminder.'
                }
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.VITE_APP_URL || 'https://legacyguard.vercel.app'}/vault" 
                   style="display: inline-block; background: ${EmailColors.brandStart}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                  View Test Vault
                </a>
              </div>
              
              <div style="border-top: 1px solid ${EmailColors.panelBorder}; padding-top: 24px; margin-top: 32px;">
                <p style="margin: 0; font-size: 14px; color: ${EmailColors.mutedText};">
                  Testing with care,<br>
                  <strong>Sofia</strong><br>
                  <span style="font-style: italic;">Your LegacyGuard Assistant (Test Mode)</span>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: ${EmailColors.background}; padding: 16px 24px; text-align: center; border-top: 1px solid ${EmailColors.panelBorder};">
              <p style="margin: 0; font-size: 12px; color: ${EmailColors.mutedText};">
                This was a test email from LegacyGuard's notification system.<br>
                Sent to: ${email}
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests for testing
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, documentName, daysUntil }: TestNotificationRequest = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    console.log(`Sending test notification to: ${email}`);

    const { subject, html } = getTestEmailTemplate(
      email, 
      documentName || 'Test Document.pdf', 
      daysUntil || 7
    );

    const result = await resend.emails.send({
      from: 'Sofia from LegacyGuard (Test) <sofia@legacyguard.app>',
      to: email,
      subject,
      html
    });

    // Handle both old and new Resend API response formats
    const emailId = (result as any).data?.id || (result as any).id;
    
    if (emailId) {
      console.log('Test email sent successfully:', emailId);
      return res.status(200).json({
        message: 'Test notification sent successfully',
        email,
        documentName: documentName || 'Test Document.pdf',
        daysUntil: daysUntil || 7,
        emailId: emailId
      });
    } else {
      const errorMessage = (result as any).error?.message || 'Failed to get email ID';
      console.error('Failed to send test email:', errorMessage);
      return res.status(500).json({
        message: 'Failed to send test notification',
        error: errorMessage
      });
    }

  } catch (error) {
    console.error('Error sending test notification:', error);
    
    return res.status(500).json({
      message: 'Failed to send test notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}