/**
 * Email Notification Service for Professional Reviews
 * Handles email notifications for review requests, assignments, and completions
 */

import type { ReviewRequest, DocumentReview, ProfessionalReviewer, ReviewResult } from '@/types/professional';

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface EmailNotification {
  to: string[];
  cc?: string[];
  bcc?: string[];
  template: EmailTemplate;
  data: Record<string, any>;
}

export class ProfessionalEmailNotificationService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.legacyguard.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Send email notification to professional reviewer about new review request
   */
  async notifyReviewerNewRequest(
    reviewer: ProfessionalReviewer,
    request: ReviewRequest,
    documentName: string
  ): Promise<void> {
    const template = this.generateNewRequestTemplate(reviewer, request, documentName);

    const notification: EmailNotification = {
      to: [reviewer.email],
      template,
      data: {
        reviewerId: reviewer.id,
        requestId: request.id,
        documentName,
        reviewType: request.review_type,
        priority: request.priority,
        estimatedFee: this.calculateEstimatedFee(request),
        deadlineFormatted: request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Flexible',
        responseDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString() // 48 hours from now
      }
    };

    await this.sendEmail(notification);
  }

  /**
   * Send confirmation email to client when review is requested
   */
  async notifyClientReviewRequested(
    clientEmail: string,
    clientName: string,
    request: ReviewRequest,
    documentName: string
  ): Promise<void> {
    const template = this.generateClientConfirmationTemplate(clientName, request, documentName);

    const notification: EmailNotification = {
      to: [clientEmail],
      template,
      data: {
        clientName,
        documentName,
        reviewType: request.review_type,
        estimatedCost: this.calculateEstimatedFee(request),
        expectedTimeframe: this.getExpectedTimeframe(request.review_type),
        requestId: request.id,
        supportEmail: 'support@legacyguard.com'
      }
    };

    await this.sendEmail(notification);
  }

  /**
   * Send notification when review is assigned to attorney
   */
  async notifyReviewAssigned(
    reviewer: ProfessionalReviewer,
    review: DocumentReview,
    documentName: string,
    clientName: string
  ): Promise<void> {
    const template = this.generateAssignmentTemplate(reviewer, review, documentName, clientName);

    const notification: EmailNotification = {
      to: [reviewer.email],
      template,
      data: {
        reviewerName: reviewer.full_name,
        clientName,
        documentName,
        reviewType: review.review_type,
        priority: review.priority,
        dueDate: review.due_date ? new Date(review.due_date).toLocaleDateString() : 'No specific deadline',
        reviewFee: review.review_fee || 0,
        reviewId: review.id,
        dashboardUrl: `${this.baseUrl}/professional/dashboard`,
        documentUrl: `${this.baseUrl}/professional/review/${review.id}`
      }
    };

    await this.sendEmail(notification);
  }

  /**
   * Send notification to client when review is completed
   */
  async notifyClientReviewCompleted(
    clientEmail: string,
    clientName: string,
    review: DocumentReview,
    result: ReviewResult,
    reviewerName: string,
    documentName: string
  ): Promise<void> {
    const template = this.generateCompletionTemplate(clientName, review, result, reviewerName, documentName);

    const notification: EmailNotification = {
      to: [clientEmail],
      template,
      data: {
        clientName,
        reviewerName,
        documentName,
        overallStatus: result.overall_status,
        trustScoreImpact: result.trust_score_impact,
        recommendationsCount: result.recommendations.length,
        issuesCount: result.issues_found.length,
        reviewUrl: `${this.baseUrl}/reviews/${review.id}`,
        dashboardUrl: `${this.baseUrl}/dashboard`
      }
    };

    await this.sendEmail(notification);
  }

  /**
   * Send reminder to attorney about pending review
   */
  async sendReviewReminder(
    reviewer: ProfessionalReviewer,
    review: DocumentReview,
    documentName: string,
    daysOverdue: number = 0
  ): Promise<void> {
    const template = this.generateReminderTemplate(reviewer, review, documentName, daysOverdue);

    const notification: EmailNotification = {
      to: [reviewer.email],
      template,
      data: {
        reviewerName: reviewer.full_name,
        documentName,
        reviewType: review.review_type,
        assignedDate: new Date(review.assigned_at || '').toLocaleDateString(),
        daysOverdue,
        isOverdue: daysOverdue > 0,
        reviewId: review.id,
        dashboardUrl: `${this.baseUrl}/professional/dashboard`
      }
    };

    await this.sendEmail(notification);
  }

  private generateNewRequestTemplate(
    reviewer: ProfessionalReviewer,
    request: ReviewRequest,
    documentName: string
  ): EmailTemplate {
    const subject = `New ${request.review_type} Review Request - ${documentName}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Review Request</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none; }
          .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
          .button.secondary { background: #6B7280; }
          .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; }
          .priority-urgent { background: #FEF2F2; border-left-color: #EF4444; }
          .priority-high { background: #FFFBEB; border-left-color: #F59E0B; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚖️ New Review Request</h1>
            <p>A new document review has been assigned to you</p>
          </div>
          
          <div class="content">
            <h2>Hello {{reviewerName}},</h2>
            
            <p>You have received a new {{reviewType}} review request for a family protection document.</p>
            
            <div class="info-box {{#if isHighPriority}}priority-{{priority}}{{/if}}">
              <h3>📄 Review Details</h3>
              <ul>
                <li><strong>Document:</strong> {{documentName}}</li>
                <li><strong>Review Type:</strong> {{reviewType}}</li>
                <li><strong>Priority:</strong> {{priority}}</li>
                <li><strong>Estimated Fee:</strong> ${{estimatedFee}}</li>
                <li><strong>Deadline:</strong> {{deadlineFormatted}}</li>
              </ul>
            </div>

            <div class="info-box">
              <h3>👨‍👩‍👧‍👦 Family Context</h3>
              <p>This review will help protect {{familyMembersCount}} family members. The client has specifically requested your expertise to ensure their family's legacy is properly secured.</p>
            </div>

            <p><strong>⏰ Please respond by {{responseDeadline}}</strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{acceptUrl}}" class="button">Accept Review</a>
              <a href="{{declineUrl}}" class="button secondary">Decline</a>
            </div>

            <p>Thank you for being part of the LegacyGuard professional network. Your expertise helps families protect what matters most.</p>
          </div>
          
          <div class="footer">
            <p><small>LegacyGuard Professional Network • <a href="{{dashboardUrl}}">Dashboard</a> • <a href="{{supportUrl}}">Support</a></small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
New ${request.review_type} Review Request

Hello ${reviewer.full_name},

You have received a new ${request.review_type} review request.

Document: ${documentName}
Review Type: ${request.review_type}
Priority: ${request.priority}
Estimated Fee: $${this.calculateEstimatedFee(request)}
Deadline: ${request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Flexible'}

Please respond by ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString()}

Accept: ${this.baseUrl}/professional/accept/${request.id}
Decline: ${this.baseUrl}/professional/decline/${request.id}

Thank you,
LegacyGuard Professional Network
    `;

    return { subject, htmlBody, textBody };
  }

  private generateClientConfirmationTemplate(
    clientName: string,
    request: ReviewRequest,
    documentName: string
  ): EmailTemplate {
    const subject = `Professional Review Requested - ${documentName}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Review Request Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none; }
          .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; }
          .success-box { background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Review Request Submitted</h1>
            <p>Your professional review has been requested</p>
          </div>
          
          <div class="content">
            <h2>Hello {{clientName}},</h2>
            
            <div class="success-box">
              <h3>🎉 Great choice!</h3>
              <p>You've taken an important step in protecting your family's future. Professional review ensures your {{documentName}} meets all legal requirements.</p>
            </div>
            
            <div class="info-box">
              <h3>📋 What happens next?</h3>
              <ol>
                <li><strong>Attorney Matching (within 2 hours):</strong> We'll match you with a qualified estate planning attorney</li>
                <li><strong>Review Assignment:</strong> You'll receive confirmation with attorney details</li>
                <li><strong>Professional Review ({{expectedTimeframe}}):</strong> Your attorney will conduct a thorough analysis</li>
                <li><strong>Results & Recommendations:</strong> You'll receive detailed feedback and next steps</li>
              </ol>
            </div>

            <div class="info-box">
              <h3>💼 Your Review Details</h3>
              <ul>
                <li><strong>Document:</strong> {{documentName}}</li>
                <li><strong>Review Type:</strong> {{reviewType}}</li>
                <li><strong>Estimated Cost:</strong> ${{estimatedCost}}</li>
                <li><strong>Expected Timeframe:</strong> {{expectedTimeframe}}</li>
              </ul>
            </div>

            <p>We'll keep you updated throughout the process. If you have any questions, our support team is here to help.</p>
          </div>
          
          <div class="footer">
            <p><small>LegacyGuard • <a href="{{dashboardUrl}}">View Dashboard</a> • <a href="{{supportEmail}}">Contact Support</a></small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Professional Review Request Confirmed

Hello ${clientName},

Your professional review request has been submitted successfully!

Document: ${documentName}
Review Type: ${request.review_type}
Estimated Cost: $${this.calculateEstimatedFee(request)}
Expected Timeframe: ${this.getExpectedTimeframe(request.review_type)}

What happens next:
1. Attorney matching (within 2 hours)
2. Review assignment confirmation
3. Professional review (${this.getExpectedTimeframe(request.review_type)})
4. Results and recommendations delivered

We'll keep you updated throughout the process.

Best regards,
LegacyGuard Team
    `;

    return { subject, htmlBody, textBody };
  }

  private generateAssignmentTemplate(
    reviewer: ProfessionalReviewer,
    review: DocumentReview,
    documentName: string,
    clientName: string
  ): EmailTemplate {
    const subject = `Review Assignment Confirmed - ${documentName}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Review Assignment</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none; }
          .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
          .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; }
          .success-box { background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Review Assignment</h1>
            <p>You've been assigned a new document review</p>
          </div>
          
          <div class="content">
            <h2>Hello {{reviewerName}},</h2>
            
            <div class="success-box">
              <h3>✅ Assignment Confirmed</h3>
              <p>Thank you for accepting this review. A family is counting on your professional expertise to help protect their legacy.</p>
            </div>
            
            <div class="info-box">
              <h3>📄 Review Assignment</h3>
              <ul>
                <li><strong>Client:</strong> {{clientName}}</li>
                <li><strong>Document:</strong> {{documentName}}</li>
                <li><strong>Review Type:</strong> {{reviewType}}</li>
                <li><strong>Priority:</strong> {{priority}}</li>
                <li><strong>Due Date:</strong> {{dueDate}}</li>
                <li><strong>Review Fee:</strong> ${{reviewFee}}</li>
              </ul>
            </div>

            <div class="info-box">
              <h3>🚀 Next Steps</h3>
              <ol>
                <li>Access the document using the secure review portal</li>
                <li>Conduct your professional analysis</li>
                <li>Provide recommendations and feedback</li>
                <li>Submit your completed review</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{documentUrl}}" class="button">Start Review</a>
              <a href="{{dashboardUrl}}" class="button" style="background: #6B7280;">Dashboard</a>
            </div>

            <p>The client will be notified that you've been assigned to their review. Thank you for your professionalism and expertise.</p>
          </div>
          
          <div class="footer">
            <p><small>LegacyGuard Professional Network • Review ID: {{reviewId}}</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Review Assignment Confirmed

Hello ${reviewer.full_name},

You have been assigned a new document review:

Client: ${clientName}
Document: ${documentName}
Review Type: ${review.review_type}
Priority: ${review.priority}
Due Date: ${review.due_date ? new Date(review.due_date).toLocaleDateString() : 'No specific deadline'}
Review Fee: $${review.review_fee || 0}

Start Review: ${this.baseUrl}/professional/review/${review.id}
Dashboard: ${this.baseUrl}/professional/dashboard

Thank you for your professionalism.

LegacyGuard Professional Network
    `;

    return { subject, htmlBody, textBody };
  }

  private generateCompletionTemplate(
    clientName: string,
    review: DocumentReview,
    result: ReviewResult,
    reviewerName: string,
    documentName: string
  ): EmailTemplate {
    const subject = `Professional Review Complete - ${documentName}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Review Complete</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none; }
          .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
          .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; }
          .success-box { background: #F0FDF4; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0; }
          .status-approved { color: #10B981; font-weight: bold; }
          .status-changes { color: #F59E0B; font-weight: bold; }
          .status-revision { color: #EF4444; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Review Complete</h1>
            <p>Your professional review results are ready</p>
          </div>
          
          <div class="content">
            <h2>Hello {{clientName}},</h2>
            
            <div class="success-box">
              <h3>✅ Professional Review Completed</h3>
              <p><strong>{{reviewerName}}</strong> has completed the professional review of your {{documentName}}. Your trust score has been updated with the results.</p>
            </div>
            
            <div class="info-box">
              <h3>📊 Review Summary</h3>
              <ul>
                <li><strong>Overall Status:</strong> <span class="status-{{overallStatus}}">{{overallStatus}}</span></li>
                <li><strong>Trust Score Impact:</strong> {{#if trustScorePositive}}+{{trustScoreImpact}}{{else}}{{trustScoreImpact}}{{/if}} points</li>
                <li><strong>Recommendations:</strong> {{recommendationsCount}} items</li>
                <li><strong>Issues Found:</strong> {{issuesCount}} items</li>
              </ul>
            </div>

            {{#if hasRecommendations}}
            <div class="info-box">
              <h3>💡 Key Recommendations</h3>
              <p>Your attorney has provided {{recommendationsCount}} specific recommendations to strengthen your family's protection. These insights will help ensure your legacy plan is comprehensive and legally sound.</p>
            </div>
            {{/if}}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{reviewUrl}}" class="button">View Detailed Report</a>
              <a href="{{dashboardUrl}}" class="button" style="background: #6B7280;">Go to Dashboard</a>
            </div>

            <p>Thank you for choosing professional review. This investment in professional guidance helps ensure your family's future is properly protected.</p>
          </div>
          
          <div class="footer">
            <p><small>LegacyGuard • Professional Review by {{reviewerName}}</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Professional Review Complete

Hello ${clientName},

${reviewerName} has completed the professional review of your ${documentName}.

Review Summary:
- Overall Status: ${result.overall_status}
- Trust Score Impact: ${result.trust_score_impact > 0 ? '+' : ''}${result.trust_score_impact} points
- Recommendations: ${result.recommendations.length}
- Issues Found: ${result.issues_found.length}

View Detailed Report: ${this.baseUrl}/reviews/${review.id}
Dashboard: ${this.baseUrl}/dashboard

Thank you for choosing professional review.

Best regards,
LegacyGuard Team
    `;

    return { subject, htmlBody, textBody };
  }

  private generateReminderTemplate(
    reviewer: ProfessionalReviewer,
    review: DocumentReview,
    documentName: string,
    daysOverdue: number
  ): EmailTemplate {
    const subject = daysOverdue > 0
      ? `OVERDUE: Review Reminder - ${documentName}`
      : `Friendly Reminder: Review Due Soon - ${documentName}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Review Reminder</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${daysOverdue > 0 ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #F59E0B, #D97706)'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; }
          .footer { background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none; }
          .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
          .warning-box { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; margin: 20px 0; }
          .info-box { background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${daysOverdue > 0 ? '⚠️' : '⏰'} Review Reminder</h1>
            <p>${daysOverdue > 0 ? 'This review is overdue' : 'Review due soon'}</p>
          </div>
          
          <div class="content">
            <h2>Hello {{reviewerName}},</h2>
            
            ${daysOverdue > 0 ? `
            <div class="warning-box">
              <h3>⚠️ Review Overdue</h3>
              <p>This review is now <strong>{{daysOverdue}} days overdue</strong>. A family is waiting for your professional guidance to protect their legacy.</p>
            </div>
            ` : `
            <div class="info-box">
              <h3>⏰ Friendly Reminder</h3>
              <p>This is a friendly reminder about your pending review assignment. A family is counting on your expertise.</p>
            </div>
            `}
            
            <div class="info-box">
              <h3>📄 Review Details</h3>
              <ul>
                <li><strong>Document:</strong> {{documentName}}</li>
                <li><strong>Review Type:</strong> {{reviewType}}</li>
                <li><strong>Assigned:</strong> {{assignedDate}}</li>
                <li><strong>Status:</strong> ${daysOverdue > 0 ? 'Overdue' : 'Due Soon'}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{reviewUrl}}" class="button">Complete Review Now</a>
              <a href="{{dashboardUrl}}" class="button" style="background: #6B7280;">Dashboard</a>
            </div>

            <p>If you need assistance or have any questions, please contact our support team. Thank you for your professionalism.</p>
          </div>
          
          <div class="footer">
            <p><small>LegacyGuard Professional Network • Review ID: {{reviewId}}</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
${daysOverdue > 0 ? 'OVERDUE: ' : ''}Review Reminder

Hello ${reviewer.full_name},

${daysOverdue > 0
  ? `This review is now ${daysOverdue} days overdue.`
  : 'This is a friendly reminder about your pending review assignment.'
}

Document: ${documentName}
Review Type: ${review.review_type}
Assigned: ${new Date(review.assigned_at || '').toLocaleDateString()}

Complete Review: ${this.baseUrl}/professional/review/${review.id}
Dashboard: ${this.baseUrl}/professional/dashboard

Thank you for your professionalism.

LegacyGuard Professional Network
    `;

    return { subject, htmlBody, textBody };
  }

  private async sendEmail(notification: EmailNotification): Promise<void> {
    // Mock implementation - replace with actual email service (SendGrid, AWS SES, etc.)
    console.log('Sending email notification:', {
      to: notification.to,
      subject: notification.template.subject,
      data: notification.data
    });

    // In production, this would integrate with your email service
    // Example with SendGrid:
    /*
    const msg = {
      to: notification.to,
      cc: notification.cc,
      bcc: notification.bcc,
      from: 'noreply@legacyguard.com',
      subject: this.processTemplate(notification.template.subject, notification.data),
      html: this.processTemplate(notification.template.htmlBody, notification.data),
      text: this.processTemplate(notification.template.textBody, notification.data)
    };

    await sgMail.send(msg);
    */
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private calculateEstimatedFee(request: ReviewRequest): number {
    const basePrice = {
      basic: 200,
      comprehensive: 425,
      certified: 625
    };

    let cost = basePrice[request.review_type];

    // Priority adjustments
    if (request.priority === 'urgent') cost *= 1.5;
    else if (request.priority === 'high') cost *= 1.25;

    // Family complexity adjustments
    if (request.family_context.complex_assets) cost += 50;
    if (request.family_context.business_interests) cost += 75;
    if (request.family_context.minor_children) cost += 25;

    return Math.round(cost);
  }

  private getExpectedTimeframe(reviewType: ReviewRequest['review_type']): string {
    switch (reviewType) {
      case 'basic': return '3-5 business days';
      case 'comprehensive': return '5-7 business days';
      case 'certified': return '7-10 business days';
      default: return '5-7 business days';
    }
  }
}
