// Gmail API for Google Workspace integration
// This replaces Nodemailer for better Google Workspace compatibility

export interface WaitlistSubmission {
  email: string
  full_name: string
  phone?: string
  boat_length?: string
  selected_slips: string[]
  message?: string
}

export interface SlipInfo {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
}

export interface AdminInvitation {
  email: string
  full_name: string
  invited_by_name: string
  token: string
  expires_at: string
  message?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  created_at: string
}

// Gmail API helper functions
async function getGmailAccessToken() {
  // For Google Workspace, you'll need to set up OAuth2 credentials
  // This is a placeholder - you'll need to implement OAuth2 flow
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth2 credentials not configured')
  }

  // This is a simplified version - you'll need proper OAuth2 implementation
  // For now, we'll use the existing Gmail app password approach
  return process.env.GMAIL_APP_PASSWORD
}

async function sendGmailMessage(to: string, subject: string, textContent: string, htmlContent: string) {
  const fromEmail = process.env.GMAIL_USER || 'john@marinabts.com'
  
  // For Google Workspace, you have a few options:
  // 1. Use Gmail API with OAuth2 (most secure, recommended)
  // 2. Use Gmail SMTP with app password (current approach)
  // 3. Use Google Workspace Admin SDK
  
  // For now, let's keep the existing Gmail SMTP approach but prepare for Gmail API
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Use existing Gmail SMTP setup
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    const mailOptions = {
      from: `"Marina By-The-Sea" <${fromEmail}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent
    }

    return await transporter.sendMail(mailOptions)
  } else {
    // Fallback: prepare for Gmail API implementation
    throw new Error('Email service not configured. Please set up Gmail credentials or implement Gmail API OAuth2.')
  }
}

export async function sendAdminInvitationEmail(invitation: AdminInvitation) {
  console.log('[Admin Invitation] Starting email sending process...')
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'
    const setupUrl = `${baseUrl}/auth/setup-admin?token=${invitation.token}`
    const expiresDate = new Date(invitation.expires_at).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailContent = `
Admin Account Invitation - Marina By-The-Sea

Dear ${invitation.full_name},

You have been invited to join the Marina By-The-Sea administrative team!

🎯 INVITATION DETAILS:
Invited by: ${invitation.invited_by_name}
Expires: ${expiresDate}

${invitation.message ? `\n💬 PERSONAL MESSAGE:\n${invitation.message}\n` : ''}

🔐 SETUP YOUR ACCOUNT:
To complete your admin account setup, please click the link below:

${setupUrl}

⚠️  IMPORTANT NOTES:
• This invitation expires on ${expiresDate}
• You will be able to set your own password during setup
• Your account will have administrative access to the marina system
• Keep this invitation link secure and private

🚤 WHAT YOU'LL BE ABLE TO DO:
• Manage dock slips and availability
• Process waitlist applications
• Edit blog posts and content
• Access administrative functions
• View system analytics and reports

📧 NEED HELP?
If you have any questions or need assistance, please contact the marina administration team.

---
Marina By-The-Sea
Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida
  `.trim()

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚤 Marina By-The-Sea</h1>
          <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Admin Account Invitation</p>
        </div>
        
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Welcome to the Team!</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Dear <strong>${invitation.full_name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            You have been invited to join the Marina By-The-Sea administrative team! We're excited to have you on board.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">🎯 Invitation Details</h3>
            <p style="color: #374151; margin: 5px 0;"><strong>Invited by:</strong> ${invitation.invited_by_name}</p>
            <p style="color: #374151; margin: 5px 0;"><strong>Expires:</strong> ${expiresDate}</p>
          </div>
          
          ${invitation.message ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">💬 Personal Message</h3>
            <p style="color: #92400e; margin: 0; font-style: italic;">"${invitation.message}"</p>
          </div>
          ` : ''}
          
          <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 20px;">🔐 Setup Your Account</h3>
            <p style="color: #065f46; margin-bottom: 20px; font-size: 16px;">
              Click the button below to complete your admin account setup:
            </p>
            <a href="${setupUrl}" style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              🚀 Setup Admin Account
            </a>
            <p style="color: #065f46; margin-top: 15px; font-size: 14px;">
              Or copy this link: <a href="${setupUrl}" style="color: #059669;">${setupUrl}</a>
            </p>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">⚠️ Important Notes</h3>
            <ul style="color: #991b1b; margin: 10px 0; padding-left: 20px;">
              <li>This invitation expires on <strong>${expiresDate}</strong></li>
              <li>You will be able to set your own password during setup</li>
              <li>Your account will have administrative access to the marina system</li>
              <li>Keep this invitation link secure and private</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin-top: 0; font-size: 18px;">🚤 What You'll Be Able To Do</h3>
            <ul style="color: #0c4a6e; margin: 10px 0; padding-left: 20px;">
              <li>Manage dock slips and availability</li>
              <li>Process waitlist applications</li>
              <li>Edit blog posts and content</li>
              <li>Access administrative functions</li>
              <li>View system analytics and reports</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Need help? Contact the marina administration team.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f9fafb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Marina By-The-Sea<br>
            Premium Floating Dock Slips in Lauderdale-By-The-Sea, Florida
          </p>
        </div>
      </div>
    `

    console.log('[Admin Invitation] Sending email to:', invitation.email)
    const info = await sendGmailMessage(
      invitation.email,
      '🚤 Admin Account Invitation - Marina By-The-Sea',
      emailContent,
      htmlContent
    )
    
    console.log('[Admin Invitation] Email sent successfully:', info.messageId)
    return info
    
  } catch (error) {
    console.error('[Admin Invitation] Failed to send email:', error)
    throw error
  }
}

export async function sendWaitlistNotificationToAdmins(
  submission: WaitlistSubmission,
  slipDetails: SlipInfo[]
) {
  console.log('[Waitlist] Starting admin notification process...')
  
  try {
    const adminEmails = await getAdminEmails()
    console.log('[Waitlist] Admin emails found:', adminEmails)
    
    if (adminEmails.length === 0) {
      console.warn('[Waitlist] No admin emails found for waitlist notification')
      return
    }

    const slipDetailsText = slipDetails.map(slip => 
      `• Slip ${slip.slip_number}: ${slip.length_capacity}' × ${slip.beam_capacity}' (${slip.is_available ? 'Available' : 'Occupied'})`
    ).join('\n')

    const emailContent = `
New Waitlist Submission - Marina By-The-Sea

📋 SUBMISSION DETAILS:
Name: ${submission.full_name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Boat Length: ${submission.boat_length ? `${submission.boat_length} ft` : 'Not specified'}

🚤 INTERESTED SLIPS:
${slipDetailsText}

💬 MESSAGE:
${submission.message || 'No additional message'}

📅 SUBMITTED: ${new Date().toLocaleString()}

🔗 VIEW IN ADMIN: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'}/admin/waitlist

---
This is an automated notification from Marina By-The-Sea
    `.trim()

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🚤 New Waitlist Submission - Marina By-The-Sea
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 SUBMISSION DETAILS</h3>
          <p><strong>Name:</strong> ${submission.full_name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
          <p><strong>Boat Length:</strong> ${submission.boat_length ? `${submission.boat_length} ft` : 'Not specified'}</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0c4a6e; margin-top: 0;">🚤 INTERESTED SLIPS</h3>
          <pre style="white-space: pre-wrap; margin: 0;">${slipDetailsText}</pre>
        </div>
        
        ${submission.message ? `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">💬 MESSAGE</h3>
          <p style="margin: 0;">${submission.message}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'}/admin/waitlist" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View in Admin Panel
          </a>
        </div>
      </div>
    `

    // Send to all admin emails
    for (const adminEmail of adminEmails) {
      try {
        await sendGmailMessage(
          adminEmail,
          '🚤 New Waitlist Submission - Marina By-The-Sea',
          emailContent,
          htmlContent
        )
        console.log('[Waitlist] Notification sent to:', adminEmail)
      } catch (error) {
        console.error('[Waitlist] Failed to send to:', adminEmail, error)
      }
    }
    
  } catch (error) {
    console.error('[Waitlist] Error in admin notification process:', error)
    throw error
  }
}

export async function sendContactConfirmationToUser(submission: ContactSubmission) {
  console.log('[Contact] Sending confirmation to user...')
  
  try {
    const emailContent = `
Thank you for contacting Marina By-The-Sea!

Dear ${submission.name},

Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.

📋 MESSAGE DETAILS:
Subject: ${submission.subject || 'General Inquiry'}
Message: ${submission.message}
Submitted: ${new Date(submission.created_at).toLocaleString()}

📧 OUR RESPONSE:
We typically respond within 24-48 hours during business days.

🚤 ABOUT MARINA BY-THE-SEA:
We offer premium floating dock slips in beautiful Lauderdale-By-The-Sea, Florida, with:
• 24/7 access to your vessel
• Fuel refueling services
• Marine detailing services
• Professional marina staff

If you have any urgent questions, please call us directly.

Best regards,
The Marina By-The-Sea Team
    `.trim()

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🚤 Thank you for contacting Marina By-The-Sea!
        </h2>
        
        <p style="color: #374151; font-size: 16px;">
          Dear <strong>${submission.name}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px;">
          Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 MESSAGE DETAILS</h3>
          <p><strong>Subject:</strong> ${submission.subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong> ${submission.message}</p>
          <p><strong>Submitted:</strong> ${new Date(submission.created_at).toLocaleString()}</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0c4a6e; margin-top: 0;">📧 OUR RESPONSE</h3>
          <p style="margin: 0;">We typically respond within 24-48 hours during business days.</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #065f46; margin-top: 0;">🚤 ABOUT MARINA BY-THE-SEA</h3>
          <p style="margin: 0;">We offer premium floating dock slips in beautiful Lauderdale-By-The-Sea, Florida, with:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>24/7 access to your vessel</li>
            <li>Fuel refueling services</li>
            <li>Marine detailing services</li>
            <li>Professional marina staff</li>
          </ul>
        </div>
        
        <p style="color: #374151; font-size: 14px;">
          If you have any urgent questions, please call us directly.
        </p>
        
        <p style="color: #374151; font-size: 16px;">
          Best regards,<br>
          The Marina By-The-Sea Team
        </p>
      </div>
    `

    await sendGmailMessage(
      submission.email,
      '🚤 Thank you for contacting Marina By-The-Sea!',
      emailContent,
      htmlContent
    )
    
    console.log('[Contact] Confirmation sent to user successfully')
    
  } catch (error) {
    console.error('[Contact] Failed to send confirmation to user:', error)
    throw error
  }
}

export async function sendContactNotificationToAdmins(submission: ContactSubmission) {
  console.log('[Contact] Sending notification to admins...')
  
  try {
    const adminEmails = await getAdminEmails()
    
    if (adminEmails.length === 0) {
      console.warn('[Contact] No admin emails found for contact notification')
      return
    }

    const emailContent = `
New Contact Form Submission - Marina By-The-Sea

📋 SUBMISSION DETAILS:
Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Subject: ${submission.subject || 'General Inquiry'}
Message: ${submission.message}

📅 SUBMITTED: ${new Date(submission.created_at).toLocaleString()}

🔗 VIEW IN ADMIN: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'}/admin/contacts

---
This is an automated notification from Marina By-The-Sea
    `.trim()

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🚤 New Contact Form Submission - Marina By-The-Sea
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📋 SUBMISSION DETAILS</h3>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${submission.subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong> ${submission.message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'}/admin/contacts" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View in Admin Panel
          </p>
        </div>
      </div>
    `

    // Send to all admin emails
    for (const adminEmail of adminEmails) {
      try {
        await sendGmailMessage(
          adminEmail,
          '🚤 New Contact Form Submission - Marina By-The-Sea',
          emailContent,
          htmlContent
        )
        console.log('[Contact] Notification sent to admin:', adminEmail)
      } catch (error) {
        console.error('[Contact] Failed to send to admin:', adminEmail, error)
      }
    }
    
  } catch (error) {
    console.error('[Contact] Error in admin notification process:', error)
    throw error
  }
}

async function getAdminEmails(): Promise<string[]> {
  try {
    // This would typically fetch from your database
    // For now, return the configured admin emails
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    
    if (adminEmails.length === 0) {
      // Fallback to default marina emails
      return ['john@marinabts.com', 'info@marinabts.com'].filter(Boolean)
    }
    
    return adminEmails.map(email => email.trim()).filter(Boolean)
  } catch (error) {
    console.error('Error fetching admin emails:', error)
    // Fallback to default marina emails
    return ['john@marinabts.com', 'info@marinabts.com'].filter(Boolean)
  }
}
