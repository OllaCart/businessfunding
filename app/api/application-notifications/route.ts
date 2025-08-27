import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminEmail } from '@/lib/email'
import { 
  generateApplicationApprovalEmail, 
  generateWelcomeEmail 
} from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    console.log('[Application Notifications] Starting notification process...')
    
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { applicationId, newStatus, adminNotes } = body

    if (!applicationId || !newStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[Application Notifications] Processing status change:', { applicationId, newStatus })

    // Get application details with related data
    const { data: application, error: appError } = await supabase
      .from('occupant_applications')
      .select(`
        *,
        slip_offer:slip_offer_id(
          id,
          offered_price_per_foot,
          total_monthly_cost,
          offer_expires_at,
          status
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      console.error('[Application Notifications] Error fetching application:', appError)
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    let emailSent = false
    let emailResult = null

    // Send appropriate email based on status
    switch (newStatus) {
      case 'approved':
        emailResult = await sendApplicationApprovalEmail(application, adminProfile)
        emailSent = emailResult.success
        break
        
      case 'completed':
        emailResult = await sendWelcomeEmail(application, adminProfile)
        emailSent = emailResult.success
        break
        
      case 'rejected':
        emailResult = await sendApplicationRejectionEmail(application, adminProfile, adminNotes)
        emailSent = emailResult.success
        break
        
      case 'under_review':
        emailResult = await sendApplicationReviewEmail(application, adminProfile)
        emailSent = emailResult.success
        break
        
      default:
        console.log('[Application Notifications] No email notification needed for status:', newStatus)
        break
    }

    // Log the admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action: 'application_status_updated',
        details: {
          applicationId,
          previousStatus: application.status,
          newStatus,
          adminNotes,
          emailSent,
          emailResult: emailResult?.reason || emailResult?.error || null
        },
        timestamp: new Date().toISOString()
      })

    console.log('[Application Notifications] Process completed successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'Application status updated successfully',
      emailSent,
      emailResult: emailResult?.reason || emailResult?.error || null
    })

  } catch (error) {
    console.error('[Application Notifications] Error processing notification:', error)
    return NextResponse.json(
      { error: 'Failed to process application notification' }, 
      { status: 500 }
    )
  }
}

// Send application approval email
async function sendApplicationApprovalEmail(application: any, adminProfile: any) {
  try {
    const emailData = {
      boaterName: application.owner_names,
      slipNumber: application.slip_number,
      startingDate: new Date(application.starting_date),
      totalMonthlyCost: application.total_monthly_cost,
      adminName: adminProfile.full_name,
      adminPhone: '(954) 123-4567', // This should come from admin profile or settings
      adminEmail: adminProfile.email
    }

    const { textContent, htmlContent } = generateApplicationApprovalEmail(emailData)

    const result = await sendAdminEmail({
      to: application.owner_email,
      subject: `🎉 Application Approved - Slip ${application.slip_number} at Marina By-The-Sea`,
      content: textContent,
      htmlContent: htmlContent,
      fromName: 'Marina By-The-Sea'
    })

    return result
  } catch (error) {
    console.error('[Application Notifications] Error sending approval email:', error)
    return { success: false, error: error.message }
  }
}

// Send welcome email for completed onboarding
async function sendWelcomeEmail(application: any, adminProfile: any) {
  try {
    const emailData = {
      boaterName: application.owner_names,
      slipNumber: application.slip_number,
      startingDate: new Date(application.starting_date),
      totalMonthlyCost: application.total_monthly_cost,
      adminName: adminProfile.full_name,
      marinaAddress: '230 Basin Drive, Lauderdale By-The-Sea, FL 33308',
      marinaPhone: '(954) 123-4567',
      marinaEmail: 'dylan@dreamsdev.co'
    }

    const { textContent, htmlContent } = generateWelcomeEmail(emailData)

    const result = await sendAdminEmail({
      to: application.owner_email,
      subject: `🚤 Welcome to Marina By-The-Sea - Slip ${application.slip_number}`,
      content: textContent,
      htmlContent: htmlContent,
      fromName: 'Marina By-The-Sea'
    })

    return result
  } catch (error) {
    console.error('[Application Notifications] Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Send application rejection email
async function sendApplicationRejectionEmail(application: any, adminProfile: any, adminNotes: string) {
  try {
    const textContent = `Dear ${application.owner_names},

We regret to inform you that your application for Slip ${application.slip_number} at Marina By-The-Sea has not been approved at this time.

📋 APPLICATION DETAILS:
• Slip Number: ${application.slip_number}
• Boat: ${application.boat_make} ${application.boat_model} (${application.boat_year})
• Monthly Cost: $${application.total_monthly_cost.toFixed(2)}

❌ REASON FOR REJECTION:
${adminNotes || 'Your application did not meet our current requirements.'}

💬 NEXT STEPS:
If you believe this decision was made in error, or if you would like to discuss your application further, please contact us:

• Phone: (954) 123-4567
• Email: dylan@dreamsdev.co
• Office Hours: Monday-Friday 8:00 AM - 6:00 PM

We appreciate your interest in Marina By-The-Sea and encourage you to apply again in the future when circumstances may have changed.

Best regards,
${adminProfile.full_name}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
230 Basin Drive
Lauderdale By-The-Sea, FL 33308
Phone: (954) 123-4567
Email: dylan@dreamsdev.co`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Application Status Update</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Marina By-The-Sea</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${application.owner_names},</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #991b1b; font-weight: 500; font-size: 16px;">
              We regret to inform you that your application for Slip ${application.slip_number} at Marina By-The-Sea has not been approved at this time.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📋 APPLICATION DETAILS</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Slip Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${application.slip_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Boat:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${application.boat_make} ${application.boat_model} (${application.boat_year})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
                <td style="padding: 8px 0; font-weight: bold; color: #dc2626;">$${application.total_monthly_cost.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #374151; margin-top: 0;">❌ REASON FOR REJECTION</h3>
            <p style="margin: 0; color: #991b1b;">
              ${adminNotes || 'Your application did not meet our current requirements.'}
            </p>
          </div>
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #374151; margin-top: 0;">💬 NEXT STEPS</h3>
            <p style="margin-bottom: 15px; color: #374151;">
              If you believe this decision was made in error, or if you would like to discuss your application further, please contact us:
            </p>
            <div style="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">(954) 123-4567</p>
              </div>
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">dylan@dreamsdev.co</p>
              </div>
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Office Hours:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">Mon-Fri 8AM-6PM</p>
              </div>
            </div>
          </div>
          
          <div style="text-center margin: 30px 0;">
            <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">
              We appreciate your interest in Marina By-The-Sea and encourage you to apply again in the future when circumstances may have changed.
            </p>
            <p style="color: #6b7280; margin: 0;">Best regards,</p>
            <p style="color: #dc2626; font-weight: 500; margin: 5px 0;">${adminProfile.full_name}</p>
            <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">230 Basin Drive</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Lauderdale By-The-Sea, FL 33308</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: (954) 123-4567 | Email: dylan@dreamsdev.co</p>
        </div>
      </div>`

    const result = await sendAdminEmail({
      to: application.owner_email,
      subject: `Application Status Update - Slip ${application.slip_number} at Marina By-The-Sea`,
      content: textContent,
      htmlContent: htmlContent,
      fromName: 'Marina By-The-Sea'
    })

    return result
  } catch (error) {
    console.error('[Application Notifications] Error sending rejection email:', error)
    return { success: false, error: error.message }
  }
}

// Send application review email
async function sendApplicationReviewEmail(application: any, adminProfile: any) {
  try {
    const textContent = `Dear ${application.owner_names},

Your application for Slip ${application.slip_number} at Marina By-The-Sea is now under review.

📋 APPLICATION DETAILS:
• Slip Number: ${application.slip_number}
• Boat: ${application.boat_make} ${application.boat_model} (${application.boat_year})
• Monthly Cost: $${application.total_monthly_cost.toFixed(2)}

🔍 REVIEW PROCESS:
Our team is currently reviewing your application and verifying all submitted information. This process typically takes 24-48 hours.

📅 WHAT HAPPENS NEXT:
• We'll review your boat information and payment details
• Verify insurance and registration documents
• Check slip availability and compatibility
• Contact you with our decision

💬 QUESTIONS?
If you have any questions about your application or need to provide additional information, please contact us:

• Phone: (954) 123-4567
• Email: dylan@dreamsdev.co
• Office Hours: Monday-Friday 8:00 AM - 6:00 PM

We appreciate your patience during this review process.

Best regards,
${adminProfile.full_name}
Marina By-The-Sea Administration Team

---
Marina By-The-Sea
230 Basin Drive
Lauderdale By-The-Sea, FL 33308
Phone: (954) 123-4567
Email: dylan@dreamsdev.co`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Application Under Review</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Marina By-The-Sea</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${application.owner_names},</h2>
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-weight: 500; font-size: 16px;">
              Your application for Slip ${application.slip_number} at Marina By-The-Sea is now under review.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">📋 APPLICATION DETAILS</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Slip Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${application.slip_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Boat:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${application.boat_make} ${application.boat_model} (${application.boat_year})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Monthly Cost:</strong></td>
                <td style="padding: 8px 0; font-weight: bold; color: #3b82f6;">$${application.total_monthly_cost.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="color: #374151; margin-top: 0;">🔍 REVIEW PROCESS</h3>
            <p style="margin: 0; color: #166534;">
              Our team is currently reviewing your application and verifying all submitted information. This process typically takes 24-48 hours.
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #374151; margin-top: 0;">📅 WHAT HAPPENS NEXT</h3>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              <li>We'll review your boat information and payment details</li>
              <li>Verify insurance and registration documents</li>
              <li>Check slip availability and compatibility</li>
              <li>Contact you with our decision</li>
            </ul>
          </div>
          
          <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #374151; margin-top: 0;">💬 QUESTIONS?</h3>
            <p style="margin-bottom: 15px; color: #374151;">
              If you have any questions about your application or need to provide additional information, please contact us:
            </p>
            <div style="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">(954) 123-4567</p>
              </div>
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">dylan@dreamsdev.co</p>
              </div>
              <div>
                <p style="margin: 5px 0; color: #374151;"><strong>Office Hours:</strong></p>
                <p style="margin: 0; color: #3b82f6; font-weight: 500;">Mon-Fri 8AM-6PM</p>
              </div>
            </div>
          </div>
          
          <div style="text-center margin: 30px 0;">
            <p style="color: #374151; font-weight: 500; margin-bottom: 5px;">
              We appreciate your patience during this review process.
            </p>
            <p style="color: #6b7280; margin: 0;">Best regards,</p>
            <p style="color: #3b82f6; font-weight: 500; margin: 5px 0;">${adminProfile.full_name}</p>
            <p style="color: #6b7280; margin: 0;">Marina By-The-Sea Administration Team</p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Marina By-The-Sea</strong></p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">230 Basin Drive</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Lauderdale By-The-Sea, FL 33308</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: (954) 123-4567 | Email: dylan@dreamsdev.co</p>
        </div>
      </div>`

    const result = await sendAdminEmail({
      to: application.owner_email,
      subject: `Application Under Review - Slip ${application.slip_number} at Marina By-The-Sea`,
      content: textContent,
      htmlContent: htmlContent,
      fromName: 'Marina By-The-Sea'
    })

    return result
  } catch (error) {
    console.error('[Application Notifications] Error sending review email:', error)
    return { success: false, error: error.message }
  }
}
