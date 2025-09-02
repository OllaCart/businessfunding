import { NextRequest, NextResponse } from 'next/server'
import { sendEndOccupancyEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { occupant, departureDate, message } = await request.json()

    if (!occupant || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await sendEndOccupancyEmail({
      full_name: occupant.full_name,
      email: occupant.email,
      boat_name: occupant.boat_name,
      slip_number: occupant.slip_number,
      departure_date: departureDate,
      personal_message: message || '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending end occupancy email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
