import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const available = searchParams.get("available")
    
    let query = supabase
      .from("loan_programs")
      .select("*")
      .order("program_name", { ascending: true })
    
    // Filter by loan type if specified
    if (type) {
      query = query.eq("loan_type", type)
    }
    
    // Filter by availability if specified
    if (available !== null) {
      query = query.eq("is_available", available === "true")
    }
    
    const { data: programs, error } = await query
    
    if (error) {
      console.error("Error fetching loan programs:", error)
      return NextResponse.json(
        { error: "Failed to fetch loan programs" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ programs })
    
  } catch (error) {
    console.error("Error in GET /api/loan-programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single()
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      "program_name",
      "loan_type", 
      "min_amount",
      "max_amount",
      "interest_rate_min",
      "interest_rate_max",
      "term_length_min",
      "term_length_max"
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    const { data: program, error } = await supabase
      .from("loan_programs")
      .insert({
        program_name: body.program_name,
        loan_type: body.loan_type,
        min_amount: parseFloat(body.min_amount),
        max_amount: parseFloat(body.max_amount),
        interest_rate_min: parseFloat(body.interest_rate_min),
        interest_rate_max: parseFloat(body.interest_rate_max),
        term_length_min: parseInt(body.term_length_min),
        term_length_max: parseInt(body.term_length_max),
        is_available: body.is_available !== false,
        show_rates: body.show_rates !== false,
        description: body.description || null,
        requirements: body.requirements || [],
        processing_time: body.processing_time || "2-5 business days",
        collateral_required: body.collateral_required || false,
        credit_score_min: parseInt(body.credit_score_min) || 600,
      })
      .select()
      .single()
    
    if (error) {
      console.error("Error creating loan program:", error)
      return NextResponse.json(
        { error: "Failed to create loan program" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      program,
      message: "Loan program created successfully",
    })
    
  } catch (error) {
    console.error("Error in POST /api/loan-programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single()
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      )
    }
    
    // Convert string numbers to proper types
    if (updateData.min_amount) updateData.min_amount = parseFloat(updateData.min_amount)
    if (updateData.max_amount) updateData.max_amount = parseFloat(updateData.max_amount)
    if (updateData.interest_rate_min) updateData.interest_rate_min = parseFloat(updateData.interest_rate_min)
    if (updateData.interest_rate_max) updateData.interest_rate_max = parseFloat(updateData.interest_rate_max)
    if (updateData.term_length_min) updateData.term_length_min = parseInt(updateData.term_length_min)
    if (updateData.term_length_max) updateData.term_length_max = parseInt(updateData.term_length_max)
    if (updateData.credit_score_min) updateData.credit_score_min = parseInt(updateData.credit_score_min)
    
    const { data: program, error } = await supabase
      .from("loan_programs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating loan program:", error)
      return NextResponse.json(
        { error: "Failed to update loan program" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      program,
      message: "Loan program updated successfully",
    })
    
  } catch (error) {
    console.error("Error in PUT /api/loan-programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single()
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      )
    }
    
    // Check if there are any applications for this program
    const { data: applications } = await supabase
      .from("loan_applications")
      .select("id")
      .eq("loan_program_id", id)
      .limit(1)
    
    if (applications && applications.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete program with existing applications" },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from("loan_programs")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting loan program:", error)
      return NextResponse.json(
        { error: "Failed to delete loan program" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Loan program deleted successfully",
    })
    
  } catch (error) {
    console.error("Error in DELETE /api/loan-programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
