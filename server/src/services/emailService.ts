import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// The email account credentials should be stored in environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASSWORD;

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Email templates
const getSessionUpdateTemplate = (
  username: string, 
  sessionTitle: string, 
  status: string, 
  startTime: Date, 
  reason?: string
) => {
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let statusMessage = '';
  let statusColor = '';

  switch (status) {
    case 'approved':
      statusMessage = 'has been approved';
      statusColor = '#10b981'; // green
      break;
    case 'rejected':
      statusMessage = 'has been rejected';
      statusColor = '#ef4444'; // red
      break;
    case 'cancelled':
      statusMessage = 'has been cancelled';
      statusColor = '#6b7280'; // gray
      break;
    default:
      statusMessage = 'has been updated';
      statusColor = '#4f46e5'; // indigo
  }

  const reasonSection = reason ? `
    <tr>
      <td style="padding: 20px; background-color: #f9fafb; border-radius: 5px;">
        <p><strong>Reason:</strong></p>
        <p>${reason}</p>
      </td>
    </tr>
  ` : '';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #1f2937;">Session Update</h2>
      <p>Hello ${username},</p>
      <p>Your session <strong>${sessionTitle}</strong> scheduled for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> ${statusMessage}.</p>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
        <tr>
          <td style="padding: 15px; background-color: ${statusColor}; color: white; text-align: center; border-radius: 5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            ${status.toUpperCase()}
          </td>
        </tr>
        ${reasonSection}
      </table>
      
      <p>For more details or to schedule another session, please log in to your account.</p>
      <p>Thank you for using Hedy's Studio!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  `;
};

// Function to send session status update email
export const sendSessionStatusEmail = async (
  userEmail: string,
  userName: string,
  sessionTitle: string,
  status: 'approved' | 'rejected' | 'cancelled',
  startTime: Date,
  reason?: string
) => {
  try {
    // Build the email content
    const emailHtml = getSessionUpdateTemplate(userName, sessionTitle, status, startTime, reason);
    
    // Status-specific subject lines
    let subject = '';
    switch (status) {
      case 'approved':
        subject = '✅ Your Session Has Been Approved';
        break;
      case 'rejected':
        subject = '❌ Your Session Request Was Not Approved';
        break;
      case 'cancelled':
        subject = '🚫 Your Session Has Been Cancelled';
        break;
      default:
        subject = 'Session Status Update';
    }
    
    // Email options
    const mailOptions = {
      from: `"Hedy's Studio" <${EMAIL_USER}>`,
      to: userEmail,
      subject,
      html: emailHtml
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Test the email service
export const testEmailService = async (recipientEmail: string) => {
  try {
    const mailOptions = {
      from: `"Hedy's Studio" <${EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Email Service Test',
      text: 'This is a test email from the Hedy\'s Studio email service.',
      html: '<p>This is a test email from the <strong>Hedy\'s Studio</strong> email service.</p>'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
};

/**
 * Send email notification to admin when a user updates their session time
 */
export const sendSessionUpdateEmail = async (
  adminEmail: string,
  adminName: string,
  sessionId: string,
  userName: string,
  oldTitle: string,
  newTitle: string,
  oldStartTime: Date,
  oldEndTime: Date,
  newStartTime: Date,
  newEndTime: Date
) => {
  try {
    // Format dates for display
    const formatDateTime = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const oldStart = formatDateTime(oldStartTime);
    const oldEnd = formatDateTime(oldEndTime);
    const newStart = formatDateTime(newStartTime);
    const newEnd = formatDateTime(newEndTime);

    // Create a session dashboard URL (adjust as needed for your app)
    const sessionUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin?sessionId=${sessionId}`;

    // HTML email template
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #1f2937;">Session Rescheduled</h2>
        <div style="padding: 15px; background-color: #f3f4f6; border-left: 4px solid #4f46e5; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: 500;">${userName} has rescheduled their session.</p>
        </div>
        
        <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9fafb;">
            <td style="border-bottom: 1px solid #e5e7eb; font-weight: bold;">Previous Session</td>
            <td style="border-bottom: 1px solid #e5e7eb;">
              <strong>${oldTitle}</strong><br>
              ${oldStart} to ${oldEnd.split(' ').slice(-2).join(' ')}
            </td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="border-bottom: 1px solid #e5e7eb; font-weight: bold;">New Session</td>
            <td style="border-bottom: 1px solid #e5e7eb;">
              <strong>${newTitle}</strong><br>
              ${newStart} to ${newEnd.split(' ').slice(-2).join(' ')}
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 30px;">
          <a href="${sessionUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Session Details</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
          <p>This is an automated notification from Hedy's Studio Scheduling App.</p>
        </div>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: `"Hedy's Studio" <${EMAIL_USER}>`,
      to: adminEmail,
      subject: `Session Rescheduled: ${newTitle}`,
      html: emailHtml
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

export default {
  sendSessionStatusEmail,
  sendSessionUpdateEmail,
  testEmailService
};