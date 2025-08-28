import { NextRequest, NextResponse } from 'next/server'
import { sendAdminInvitationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('[Admin Invitation API] Starting invitation email process...')

    const body = await request.json()
    const { email, full_name, invited_by_name, token, expires_at, message } = body

    console.log('[Admin Invitation API] Received data:', { 
      email, 
      full_name, 
      invited_by_name, 
      token: token ? 'provided' : 'missing', 
      expires_at, 
      message: message || 'none' 
    })

    if (!email || !full_name || !invited_by_name || !token || !expires_at) {
      console.log('[Admin Invitation API] Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create invitation object for email function
    const invitation = {
      email,
      full_name,
      invited_by_name,
      token,
      expires_at,
      message: message || undefined
    }

    // Send invitation email
    console.log('[Admin Invitation API] Sending invitation email...')
    await sendAdminInvitationEmail(invitation)

    console.log('[Admin Invitation API] Invitation email sent successfully')
    return NextResponse.json({
      success: true,
      message: 'Admin invitation email sent successfully'
    })

  } catch (error) {
    console.error('[Admin Invitation API] Error sending invitation email:', error)
    return NextResponse.json(
      { error: 'Failed to send admin invitation email' },
      { status: 500 }
    )
  }
}
