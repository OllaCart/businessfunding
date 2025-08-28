import { NextRequest, NextResponse } from 'next/server'
import { sendContactConfirmationToUser, sendContactNotificationToAdmins } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('[Contact Emails] Starting email sending process...')
    
    const body = await request.json()
    const { name, email, phone, subject, message } = body
    
    console.log('[Contact Emails] Received data:', { name, email, phone: phone ? 'provided' : 'not provided', subject: subject || 'none', messageLength: message?.length || 0 })

    if (!name || !email || !message) {
      console.log('[Contact Emails] Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create submission object for email functions
    const submission = {
      id: 'temp-id', // Not needed for emails
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      created_at: new Date().toISOString()
    }

    // Send confirmation email to user
    console.log('[Contact Emails] Sending confirmation to user...')
    await sendContactConfirmationToUser(submission)
    
    // Send notification email to admins
    console.log('[Contact Emails] Sending notification to admins...')
    await sendContactNotificationToAdmins(submission)

    console.log('[Contact Emails] All emails sent successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'Contact emails sent successfully'
    })

  } catch (error) {
    console.error('[Contact Emails] Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send contact emails' }, 
      { status: 500 }
    )
  }
}
