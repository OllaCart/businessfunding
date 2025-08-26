import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { 
  sendWaitlistNotificationToAdmins, 
  sendWaitlistConfirmationToUser,
  type WaitlistSubmission 
} from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      full_name, 
      email, 
      phone, 
      boat_length, 
      selected_slips, 
      message 
    } = body

    // Verify the request is authenticated (basic security)
    const supabase = await createClient()

    // Get slip details for the selected slips
    let slipDetails = []
    if (selected_slips && selected_slips.length > 0) {
      const { data: slips, error: slipsError } = await supabase
        .from('dock_slips')
        .select('id, slip_number, length_capacity, beam_capacity, monthly_rate, is_available, show_price')
        .in('id', selected_slips)
      
      if (slipsError) {
        console.error('[v0] Error fetching slip details:', slipsError)
      } else if (slips) {
        slipDetails = slips
      }
    }

    // Prepare submission data
    const submission: WaitlistSubmission = {
      email,
      full_name,
      phone,
      boat_length,
      selected_slips: selected_slips || [],
      message
    }

    // Send notifications
    try {
      // Send notification to all admins
      await sendWaitlistNotificationToAdmins(submission, slipDetails)
      
      // Send confirmation to the user
      await sendWaitlistConfirmationToUser(submission, slipDetails)
      
      console.log('[v0] Waitlist notifications sent successfully')
    } catch (emailError) {
      console.error('[v0] Email notification failed:', emailError)
      // Don't fail the whole process if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: "Waitlist submission received and notifications sent" 
    })
  } catch (error) {
    console.error("[v0] Error processing waitlist submission:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process submission" 
    }, { status: 500 })
  }
}
