import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Validation schema for loan application
const loanApplicationSchema = z.object({
  // Business Information
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessCity: z.string().min(1, "Business city is required"),
  businessState: z.string().min(2, "Business state is required"),
  businessZip: z.string().min(5, "Business ZIP code is required"),
  businessPhone: z.string().min(10, "Business phone is required"),
  businessEmail: z.string().email("Valid business email is required"),
  businessWebsite: z.string().url().optional().or(z.literal("")),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  monthlyRevenue: z.string().optional(),
  
  // Owner Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in XXX-XX-XXXX format"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  
  // Loan Information
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.string().min(10, "Loan purpose is required"),
  loanProgram: z.string().min(1, "Loan program is required"),
  existingDebt: z.string().optional(),
  collateral: z.string().optional(),
  
  // Financial Information
  creditScore: z.string().optional(),
  bankruptcy: z.boolean().default(false),
  taxLiens: z.boolean().default(false),
  additionalInfo: z.string().optional(),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToCreditCheck: z.boolean().refine(val => val === true, "You must agree to credit check"),
  agreeToMarketing: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = loanApplicationSchema.parse(body)
    
    // Get the loan program details
    const { data: loanProgram, error: programError } = await supabase
      .from("loan_programs")
      .select("*")
      .eq("program_name", validatedData.loanProgram)
      .single()
    
    if (programError || !loanProgram) {
      return NextResponse.json(
        { error: "Invalid loan program selected" },
        { status: 400 }
      )
    }
    
    // Create the loan application
    const { data: application, error: applicationError } = await supabase
      .from("loan_applications")
      .insert({
        // Business Information
        business_name: validatedData.businessName,
        business_type: validatedData.businessType,
        business_address: validatedData.businessAddress,
        business_city: validatedData.businessCity,
        business_state: validatedData.businessState,
        business_zip: validatedData.businessZip,
        business_phone: validatedData.businessPhone,
        business_email: validatedData.businessEmail,
        business_website: validatedData.businessWebsite || null,
        years_in_business: validatedData.yearsInBusiness,
        number_of_employees: validatedData.numberOfEmployees,
        annual_revenue: validatedData.annualRevenue,
        monthly_revenue: validatedData.monthlyRevenue || null,
        
        // Owner Information
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        ssn: validatedData.ssn,
        date_of_birth: validatedData.dateOfBirth,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip: validatedData.zip,
        
        // Loan Information
        loan_amount: parseFloat(validatedData.loanAmount),
        loan_purpose: validatedData.loanPurpose,
        loan_program_id: loanProgram.id,
        loan_program_name: loanProgram.program_name,
        existing_debt: validatedData.existingDebt ? parseFloat(validatedData.existingDebt) : null,
        collateral: validatedData.collateral || null,
        
        // Financial Information
        credit_score: validatedData.creditScore || null,
        bankruptcy: validatedData.bankruptcy,
        tax_liens: validatedData.taxLiens,
        additional_info: validatedData.additionalInfo || null,
        
        // Application Status
        status: "submitted",
        priority: "normal",
      })
      .select()
      .single()
    
    if (applicationError) {
      console.error("Error creating loan application:", applicationError)
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      )
    }
    
    // Send notification emails
    try {
      // Send confirmation email to applicant
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-application-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          applicationNumber: application.application_number,
          email: validatedData.email,
          businessName: validatedData.businessName,
          loanAmount: validatedData.loanAmount,
          loanProgram: loanProgram.program_name,
        }),
      })
      
      // Send notification to admin
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-admin-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "new_application",
          applicationId: application.id,
          applicationNumber: application.application_number,
          businessName: validatedData.businessName,
          loanAmount: validatedData.loanAmount,
          loanProgram: loanProgram.program_name,
        }),
      })
    } catch (emailError) {
      console.error("Error sending notification emails:", emailError)
      // Don't fail the application if email fails
    }
    
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      applicationNumber: application.application_number,
      message: "Application submitted successfully",
    })
    
  } catch (error) {
    console.error("Error processing loan application:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message,
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      )
    }
    
    // Get applications for the user
    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select(`
        id,
        application_number,
        business_name,
        loan_amount,
        loan_program_name,
        status,
        created_at,
        submitted_at,
        loan_programs (
          program_name,
          loan_type
        )
      `)
      .eq("email", email)
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching applications:", error)
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ applications })
    
  } catch (error) {
    console.error("Error in GET /api/loan-applications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
