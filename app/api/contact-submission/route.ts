import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Save contact submission to database
    const { data: submission, error: insertError } = await supabase
      .from('contact_submissions')
      .insert([{
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error saving contact submission:', insertError)
      throw new Error('Failed to save contact submission')
    }

    // Send confirmation email to the user
    try {
      await sendAdminEmail({
        to: email,
        subject: 'Thank you for contacting Marina By-The-Sea',
        content: `Dear ${name},

Thank you for reaching out to Marina By-The-Sea. We have received your message and will get back to you as soon as possible.

Your Message Details:
Subject: ${subject || 'General Inquiry'}
Message: ${message}

We typically respond within 24-48 hours. If you have an urgent matter, please call us at (954) 790-1588.

Best regards,
The Marina By-The-Sea Team`,
        fromName: 'Marina By-The-Sea'
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the submission if email fails
    }

    // Send notification to all admins
    try {
      const { data: admins, error: adminError } = await supabase
        .from('admin_profiles')
        .select('email, full_name')
        .eq('role', 'admin')

      if (!adminError && admins) {
        for (const admin of admins) {
          try {
            await sendAdminEmail({
              to: admin.email,
              subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
              content: `A new contact form submission has been received:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'General Inquiry'}
Message: ${message}

Submitted: ${new Date().toLocaleString()}

Please respond to this inquiry promptly.`,
              fromName: 'Contact Form System'
            })
          } catch (adminEmailError) {
            console.error(`Failed to send admin notification to ${admin.email}:`, adminEmailError)
            // Continue with other admins even if one fails
          }
        }
      }
    } catch (adminNotificationError) {
      console.error('Error sending admin notifications:', adminNotificationError)
      // Don't fail the submission if admin notifications fail
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact submission received successfully',
      submissionId: submission.id
    })

  } catch (error) {
    console.error('Error processing contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to process contact submission' }, 
      { status: 500 }
    )
  }
}
