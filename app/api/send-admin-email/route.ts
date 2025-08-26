import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
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
    const { 
      to, 
      subject, 
      content, 
      entryId, 
      slipId, 
      action,
      isPostAnnouncement = false,
      postId = null,
      postTitle = null,
      postSlug = null
    } = body

    if (!to || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send the main email
    const mainEmailResult = await sendAdminEmail({
      to,
      subject,
      content,
      fromName: adminProfile.full_name
    })

    if (!mainEmailResult.success) {
      console.warn('Main email failed:', mainEmailResult.reason || mainEmailResult.error)
      // Continue with other operations even if main email fails
    }

    // Send copy to the admin who sent the message
    const adminCopyResult = await sendAdminEmail({
      to: adminProfile.email,
      subject: `[COPY] ${subject}`,
      content: `This is a copy of the message you sent:

To: ${to}
Subject: ${subject}

${content}

---
Sent via Marina By-The-Sea Admin Panel`,
      fromName: 'System Copy'
    })

    if (!adminCopyResult.success) {
      console.warn('Admin copy failed:', adminCopyResult.reason || adminCopyResult.error)
    }

    // If this is a post announcement, send to all slipholders and waitlisted users
    if (isPostAnnouncement && postId) {
      await sendPostAnnouncementToUsers(postId, postTitle, postSlug, content, adminProfile.full_name)
    }

    // Log the action
    if (entryId || slipId) {
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action: action || 'email_sent',
          details: {
            to,
            subject,
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            entryId,
            slipId
          },
          timestamp: new Date().toISOString()
        })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      copiesSent: ['admin', 'recipient']
    })

  } catch (error) {
    console.error('Error sending admin email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    )
  }
}

async function sendPostAnnouncementToUsers(
  postId: string, 
  postTitle: string, 
  postSlug: string, 
  announcementContent: string, 
  adminName: string
) {
  try {
    const supabase = await createClient()
    
    // Get all current occupants (slipholders)
    const { data: occupants, error: occupantsError } = await supabase
      .from('current_occupants')
      .select('email, full_name')
      .not('email', 'is', null)

    if (occupantsError) {
      console.error('Error fetching occupants:', occupantsError)
      return
    }

    // Get all waitlisted users
    const { data: waitlistUsers, error: waitlistError } = await supabase
      .from('waitlist')
      .select('email, full_name')
      .not('email', 'is', null)

    if (waitlistError) {
      console.error('Error fetching waitlist users:', waitlistError)
      return
    }

    // Combine and deduplicate users
    const allUsers = new Map()
    
    // Add occupants
    occupants?.forEach((occupant: { email: string; full_name: string }) => {
      if (occupant.email) {
        allUsers.set(occupant.email, {
          email: occupant.email,
          full_name: occupant.full_name,
          type: 'slipholder'
        })
      }
    })

    // Add waitlist users (overwrite if already exists to avoid duplicates)
    waitlistUsers?.forEach((waitlistUser: { email: string; full_name: string }) => {
      if (waitlistUser.email) {
        allUsers.set(waitlistUser.email, {
          email: waitlistUser.email,
          full_name: waitlistUser.full_name,
          type: 'waitlisted'
        })
      }
    })

    const uniqueUsers = Array.from(allUsers.values())
    console.log(`Sending post announcement to ${uniqueUsers.length} users`)

    // Send announcement to each user
    for (const user of uniqueUsers) {
      try {
        const userAnnouncement = `Dear ${user.full_name},

${announcementContent}

${user.type === 'slipholder' ? 'As a current slipholder, you have priority access to this information.' : 'As a waitlisted user, we wanted to keep you informed of marina updates.'}

Read the full post: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.com'}/posts/${postSlug}

Best regards,
The Marina By-The-Sea Team
- ${adminName}`

        const emailResult = await sendAdminEmail({
          to: user.email,
          subject: `Marina Update: ${postTitle}`,
          content: userAnnouncement,
          fromName: adminName
        })

        if (!emailResult.success) {
          console.warn(`Failed to send announcement to ${user.email}:`, emailResult.reason || emailResult.error)
          // Continue with other users even if one fails
        } else {
          console.log(`Announcement sent successfully to ${user.email}`)
        }

        // Small delay to avoid overwhelming email servers
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Failed to send announcement to ${user.email}:`, error)
        // Continue with other users even if one fails
      }
    }

    console.log(`Post announcement sent to ${uniqueUsers.length} users successfully`)

  } catch (error) {
    console.error('Error sending post announcement:', error)
  }
}
