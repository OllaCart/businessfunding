import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminEmail } from '@/lib/email'
import { generateSlipOfferEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    console.log('[Slip Offers] Starting slip offer creation process...')
    
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
      waitlistEntryId, 
      slipId, 
      offeredPricePerFoot, 
      totalMonthlyCost, 
      offerExpiresAt,
      termsAndConditions 
    } = body

    // Validate required fields
    if (!waitlistEntryId || !slipId || !offeredPricePerFoot || !totalMonthlyCost || !offerExpiresAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[Slip Offers] Creating slip offer with data:', {
      waitlistEntryId,
      slipId,
      offeredPricePerFoot,
      totalMonthlyCost,
      offerExpiresAt
    })

    // Get waitlist entry details
    const { data: waitlistEntry, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('id', waitlistEntryId)
      .single()

    if (waitlistError || !waitlistEntry) {
      console.error('[Slip Offers] Error fetching waitlist entry:', waitlistError)
      return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 })
    }

    // Get slip details
    const { data: slip, error: slipError } = await supabase
      .from('dock_slips')
      .select('*')
      .eq('id', slipId)
      .single()

    if (slipError || !slip) {
      console.error('[Slip Offers] Error fetching slip:', slipError)
      return NextResponse.json({ error: 'Slip not found' }, { status: 404 })
    }

    // Check if slip is available
    if (!slip.is_available) {
      return NextResponse.json({ error: 'Slip is not available' }, { status: 400 })
    }

    // Check if waitlist entry is already offered
    if (waitlistEntry.status !== 'waitlisted') {
      return NextResponse.json({ error: 'Waitlist entry is not in waitlisted status' }, { status: 400 })
    }

    // Calculate monthly taxes (7%)
    const monthlyTaxes = (totalMonthlyCost * 0.07)

    // Create slip offer using the database function
    const { data: offerResult, error: offerError } = await supabase
      .rpc('create_slip_offer', {
        p_waitlist_entry_id: waitlistEntryId,
        p_slip_id: slipId,
        p_admin_id: user.id,
        p_offered_price_per_foot: offeredPricePerFoot,
        p_total_monthly_cost: totalMonthlyCost,
        p_offer_expires_at: offerExpiresAt,
        p_terms_and_conditions: termsAndConditions || null
      })

    if (offerError) {
      console.error('[Slip Offers] Error creating slip offer:', offerError)
      return NextResponse.json({ error: 'Failed to create slip offer' }, { status: 500 })
    }

    console.log('[Slip Offers] Slip offer created successfully, ID:', offerResult)

    // Get the created offer to get the password
    const { data: createdOffer, error: getOfferError } = await supabase
      .from('slip_offers')
      .select('*')
      .eq('id', offerResult)
      .single()

    if (getOfferError || !createdOffer) {
      console.error('[Slip Offers] Error fetching created offer:', getOfferError)
      return NextResponse.json({ error: 'Failed to retrieve offer details' }, { status: 500 })
    }

    // Generate secure form URL
    const secureFormUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://marinabts.vercel.app'}/onboarding/apply/${createdOffer.id}`

    // Prepare email data
    const emailData = {
      boaterName: waitlistEntry.full_name,
      slipNumber: slip.slip_number,
      boatLength: slip.length_capacity,
      boatBeam: slip.beam_capacity,
      pricePerFoot: offeredPricePerFoot,
      monthlyTaxes: monthlyTaxes,
      totalMonthlyCost: totalMonthlyCost,
      offerPassword: createdOffer.offer_password,
      offerExpiresAt: new Date(offerExpiresAt),
      secureFormUrl: secureFormUrl,
      adminName: adminProfile.full_name,
      termsAndConditions: termsAndConditions
    }

    // Generate email content
    const { textContent, htmlContent } = generateSlipOfferEmail(emailData)

    // Send email to the boater
    console.log('[Slip Offers] Sending slip offer email to:', waitlistEntry.email)
    const emailResult = await sendAdminEmail({
      to: waitlistEntry.email,
      subject: `🎉 Slip Available at Marina By-The-Sea - Slip ${slip.slip_number}`,
      content: textContent,
      htmlContent: htmlContent,
      fromName: 'Marina By-The-Sea'
    })

    if (!emailResult.success) {
      console.warn('[Slip Offers] Failed to send email, but offer was created:', emailResult.reason || emailResult.error)
      // Continue with offer creation even if email fails
    } else {
      console.log('[Slip Offers] Slip offer email sent successfully')
    }

    // Log the admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action: 'slip_offer_created',
        details: {
          waitlistEntryId,
          slipId,
          slipNumber: slip.slip_number,
          boaterEmail: waitlistEntry.email,
          boaterName: waitlistEntry.full_name,
          offeredPricePerFoot,
          totalMonthlyCost,
          offerExpiresAt,
          emailSent: emailResult.success
        },
        timestamp: new Date().toISOString()
      })

    console.log('[Slip Offers] Process completed successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'Slip offer created successfully',
      offerId: createdOffer.id,
      offerPassword: createdOffer.offer_password,
      emailSent: emailResult.success
    })

  } catch (error) {
    console.error('[Slip Offers] Error processing slip offer creation:', error)
    return NextResponse.json(
      { error: 'Failed to create slip offer' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Slip Offers] Fetching slip offers...')
    
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

    // Get all slip offers with related data
    const { data: offers, error: offersError } = await supabase
      .from('slip_offers')
      .select(`
        *,
        waitlist:waitlist_entry_id(
          full_name,
          email,
          phone,
          boat_length,
          preferred_slip_type
        ),
        slip:slip_id(
          slip_number,
          length_capacity,
          beam_capacity
        ),
        admin:admin_id(
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (offersError) {
      console.error('[Slip Offers] Error fetching offers:', offersError)
      return NextResponse.json({ error: 'Failed to fetch slip offers' }, { status: 500 })
    }

    console.log('[Slip Offers] Fetched offers successfully')
    return NextResponse.json({ 
      success: true, 
      offers: offers || []
    })

  } catch (error) {
    console.error('[Slip Offers] Error fetching slip offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slip offers' }, 
      { status: 500 }
    )
  }
}
