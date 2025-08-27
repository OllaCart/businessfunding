import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: slips, error } = await supabase
      .from("dock_slips")
      .select("*")
      .order("slip_number")
    
    if (error) {
      console.error("Error fetching slips:", error)
      return NextResponse.json(
        { error: "Failed to fetch slips" },
        { status: 500 }
      )
    }
    
    const availableSlips = slips?.filter((slip) => slip.is_available) || []
    
    return NextResponse.json({
      availableSlips,
      totalSlips: slips?.length || 0,
      availableCount: availableSlips.length
    })
    
  } catch (error) {
    console.error("Error in slips API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
