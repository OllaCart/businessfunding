import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get total archived users
    const { count: totalUsers, error: totalError } = await supabase
      .from('user_archive')
      .select('*', { count: 'exact', head: true })
    
    if (totalError) throw totalError
    
    // Get counts by source type
    const { data: sourceTypeCounts, error: sourceError } = await supabase
      .from('user_archive')
      .select('source_type')
    
    if (sourceError) throw sourceError
    
    const waitlistCount = sourceTypeCounts?.filter(u => u.source_type === 'waitlist').length || 0
    const contactCount = sourceTypeCounts?.filter(u => u.source_type === 'contact').length || 0
    const formerOccupantCount = sourceTypeCounts?.filter(u => u.source_type === 'former_occupant').length || 0
    const generalInterestCount = sourceTypeCounts?.filter(u => u.source_type === 'general_interest').length || 0
    
    // Get active users count
    const { count: activeUsers, error: activeError } = await supabase
      .from('user_archive')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    if (activeError) throw activeError
    
    // Get email campaigns count
    const { count: emailCampaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select('*', { count: 'exact', head: true })
    
    if (campaignsError) throw campaignsError
    
    return NextResponse.json({
      totalUsers: totalUsers || 0,
      waitlistCount,
      contactCount,
      formerOccupantCount,
      generalInterestCount,
      activeUsers: activeUsers || 0,
      emailCampaigns: emailCampaigns || 0
    })
    
  } catch (error) {
    console.error('Error fetching archive stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch archive statistics' },
      { status: 500 }
    )
  }
}
