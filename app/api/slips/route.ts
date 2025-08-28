import { createClient } from "@/lib/supabase/public"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('[Slips API] Starting to fetch slips...')
    
    const supabase = createClient()
    
    console.log('[Slips API] Supabase client created, querying dock_slips...')
    
    const { data: slips, error } = await supabase
      .from("dock_slips")
      .select("*")
      .order("slip_number")
    
    if (error) {
      console.error("[Slips API] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch slips", details: error.message },
        { status: 500 }
      )
    }
    
    console.log('[Slips API] Successfully fetched slips:', slips?.length || 0)
    
    const availableSlips = slips?.filter((slip) => slip.is_available) || []
    
    return NextResponse.json({
      availableSlips,
      totalSlips: slips?.length || 0,
      availableCount: availableSlips.length
    })
    
  } catch (error) {
    console.error("[Slips API] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
