import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!adminProfile) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { to, subject, content, entryId, slipId, action } = await request.json()

    if (!to || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send email using the existing email system
    const { sendAdminEmail } = await import('@/lib/email')
    
    await sendAdminEmail({
      to,
      subject,
      content,
      fromName: adminProfile.full_name || 'Marina By-The-Sea Admin'
    })

    // Update waitlist entry status if it's a "call" action
    if (action === 'call') {
      await supabase
        .from('waitlist')
        .update({ status: 'contacted' })
        .eq('id', entryId)
    }

    // Log the email action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action: `email_${action}`,
        target_type: 'waitlist_entry',
        target_id: entryId,
        slip_id: slipId,
        details: {
          email: to,
          subject,
          action
        }
      })

    return NextResponse.json({ success: true, message: 'Email sent successfully' })

  } catch (error) {
    console.error('Error sending admin email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    )
  }
}
