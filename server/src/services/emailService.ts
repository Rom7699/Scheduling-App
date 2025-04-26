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

export default {
  sendSessionStatusEmail,
  testEmailService
};