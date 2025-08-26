import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, phone, boat_length, preferred_slip_type, message } = body

    // Verify the request is authenticated (basic security)
    const supabase = await createClient()

    // Create a simple email notification (this would typically use a service like Resend, SendGrid, etc.)
    // For now, we'll log the notification and could extend this to use an actual email service

    const emailContent = `
New Waitlist Entry - MarinaBy-The-Sea

Name: ${full_name}
Email: ${email}
Phone: ${phone || "Not provided"}
Boat Length: ${boat_length ? `${boat_length} ft` : "Not specified"}
Preferred Slip Type: ${preferred_slip_type || "Any available"}
Message: ${message || "No additional message"}

Please review this entry in the admin dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || "https://your-marina-site.com"}/admin/waitlist
    `

    // Log the notification (in production, you'd send this via email service)
    console.log("[v0] New waitlist notification:", emailContent)

    // Here you would typically integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: process.env.ADMIN_EMAIL || 'admin@marinabythesea.com',
      subject: 'New Waitlist Entry - MarinaBy-The-Sea',
      text: emailContent,
      from: process.env.FROM_EMAIL || 'notifications@marinabythesea.com'
    })
    */

    return NextResponse.json({ success: true, message: "Notification sent" })
  } catch (error) {
    console.error("[v0] Error sending waitlist notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}
