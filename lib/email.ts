import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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

export async function sendWaitlistNotificationToAdmins(
  submission: WaitlistSubmission,
  slipDetails: SlipInfo[]
) {
  if (!resend) {
    console.warn('Resend not configured - skipping admin notification')
    return
  }

  const adminEmails = await getAdminEmails()
  
  if (adminEmails.length === 0) {
    console.warn('No admin emails found for waitlist notification')
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

🔗 VIEW IN ADMIN: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.vercel.app'}/admin/waitlist

---
This is an automated notification from Marina By-The-Sea
  `.trim()

  try {
    await resend.emails.send({
      from: 'Marina By-The-Sea <notifications@marinabts.com>',
      to: adminEmails,
      subject: '🚤 New Waitlist Submission - Marina By-The-Sea',
      text: emailContent,
      html: `
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
            <h3 style="color: #374151; margin-top: 0;">🚤 INTERESTED SLIPS</h3>
            ${slipDetails.map(slip => `
              <p style="margin: 8px 0;">
                • <strong>Slip ${slip.slip_number}:</strong> ${slip.length_capacity}' × ${slip.beam_capacity}' 
                <span style="color: ${slip.is_available ? '#059669' : '#dc2626'}; font-weight: bold;">
                  (${slip.is_available ? 'Available' : 'Occupied'})
                </span>
              </p>
            `).join('')}
          </div>
          
          ${submission.message ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">💬 MESSAGE</h3>
              <p style="margin: 0;">${submission.message}</p>
            </div>
          ` : ''}
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>🔗 View in Admin:</strong> 
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.vercel.app'}/admin/waitlist" 
                 style="color: #3b82f6; text-decoration: none;">
                Admin Dashboard
              </a>
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated notification from Marina By-The-Sea
          </p>
        </div>
      `
    })
    
    console.log(`[v0] Waitlist notification sent to ${adminEmails.length} admin(s)`)
  } catch (error) {
    console.error('[v0] Failed to send admin notification:', error)
    throw error
  }
}

export async function sendWaitlistConfirmationToUser(submission: WaitlistSubmission) {
  if (!resend) {
    console.warn('Resend not configured - skipping user confirmation')
    return
  }

  try {
    await resend.emails.send({
      from: 'Marina By-The-Sea <notifications@marinabts.com>',
      to: submission.email,
      subject: '✅ Welcome to Marina By-The-Sea Waitlist',
      text: `
Thank you for joining our waitlist!

We've received your submission and will contact you as soon as a matching slip becomes available.

📋 YOUR SUBMISSION:
Name: ${submission.full_name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Boat Length: ${submission.boat_length ? `${submission.boat_length} ft` : 'Not specified'}

🚤 INTERESTED SLIPS: ${submission.selected_slips.length > 0 ? submission.selected_slips.join(', ') : 'Any available'}

💬 MESSAGE: ${submission.message || 'No additional message'}

📅 SUBMITTED: ${new Date().toLocaleString()}

We'll be in touch soon!

Best regards,
The Marina By-The-Sea Team

---
Marina By-The-Sea
230 Basin Drive
Fort Lauderdale, FL 33315
Phone: (954) 790-1588
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">✅ Welcome to Marina By-The-Sea Waitlist</h1>
            <p style="color: #6b7280; font-size: 18px;">We're excited to have you join our exclusive community!</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #166534; font-weight: 500;">
              We've received your submission and will contact you as soon as a matching slip becomes available.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📋 YOUR SUBMISSION</h3>
            <p><strong>Name:</strong> ${submission.full_name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
            <p><strong>Boat Length:</strong> ${submission.boat_length ? `${submission.boat_length} ft` : 'Not specified'}</p>
            <p><strong>Interested Slips:</strong> ${submission.selected_slips.length > 0 ? submission.selected_slips.join(', ') : 'Any available'}</p>
            ${submission.message ? `<p><strong>Message:</strong> ${submission.message}</p>` : ''}
          </div>
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin-bottom: 0;">We'll be in touch soon!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-weight: 500;">Best regards,</p>
            <p style="color: #374151; font-weight: 500;">The Marina By-The-Sea Team</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Marina By-The-Sea</strong></p>
            <p style="margin: 5px 0;">230 Basin Drive</p>
            <p style="margin: 5px 0;">Fort Lauderdale, FL 33315</p>
            <p style="margin: 5px 0;">Phone: (954) 790-1588</p>
          </div>
        </div>
      `
    })
    
    console.log(`[v0] Waitlist confirmation sent to ${submission.email}`)
  } catch (error) {
    console.error('[v0] Failed to send user confirmation:', error)
    throw error
  }
}

async function getAdminEmails(): Promise<string[]> {
  try {
    // Create a public client to fetch admin emails
    const { createPublicClient } = await import('@/lib/supabase/public')
    const supabase = createPublicClient()
    
    const { data: adminProfiles, error } = await supabase
      .from('admin_profiles')
      .select('email')
      .not('email', 'is', null)
    
    if (error) {
      console.error('Error fetching admin emails:', error)
      return []
    }
    
    return adminProfiles?.map(profile => profile.email) || []
  } catch (error) {
    console.error('Error in getAdminEmails:', error)
    return []
  }
}
