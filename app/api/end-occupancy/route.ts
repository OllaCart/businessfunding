import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { occupantId, slipNumber } = await request.json()

    if (!occupantId || !slipNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get the occupant details first
    const { data: occupant, error: occupantError } = await supabase
      .from('current_occupants')
      .select('*')
      .eq('id', occupantId)
      .single()

    if (occupantError || !occupant) {
      return NextResponse.json(
        { error: 'Occupant not found' },
        { status: 404 }
      )
    }

    // Get the slip details
    const { data: slip, error: slipError } = await supabase
      .from('dock_slips')
      .select('*')
      .eq('slip_number', slipNumber)
      .single()

    if (slipError || !slip) {
      return NextResponse.json(
        { error: 'Slip not found' },
        { status: 404 }
      )
    }

    // Archive the occupant to user_archive table
    const { error: archiveError } = await supabase
      .from('user_archive')
      .insert({
        full_name: occupant.full_name,
        email: occupant.email,
        phone: occupant.phone,
        boat_name: occupant.boat_name,
        boat_length: occupant.boat_length,
        boat_beam: occupant.boat_beam,
        monthly_rate: occupant.monthly_rate,
        notes: occupant.notes,
        status: 'former_occupant',
        archived_at: new Date().toISOString(),
        archive_reason: 'End of occupancy',
        slip_number: slipNumber
      })

    if (archiveError) {
      console.error('Archive error:', archiveError)
      return NextResponse.json(
        { error: 'Failed to archive occupant' },
        { status: 500 }
      )
    }

    // Delete the current occupant
    const { error: deleteError } = await supabase
      .from('current_occupants')
      .delete()
      .eq('id', occupantId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete occupant' },
        { status: 500 }
      )
    }

    // Update the slip to mark it as available
    const { error: slipUpdateError } = await supabase
      .from('dock_slips')
      .update({ 
        is_available: true,
        current_occupant_id: null
      })
      .eq('id', slip.id)

    if (slipUpdateError) {
      console.error('Slip update error:', slipUpdateError)
      return NextResponse.json(
        { error: 'Failed to update slip' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error ending occupancy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
