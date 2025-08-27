"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, CheckCircle, AlertCircle, Upload, FileText } from "lucide-react"

interface SlipOffer {
  id: string
  offered_price_per_foot: number
  total_monthly_cost: number
  offer_expires_at: string
  status: string
  terms_and_conditions?: string
  slip: {
    slip_number: string
    length_capacity: number
    beam_capacity: number
  }
  waitlist: {
    full_name: string
    email: string
    phone?: string
    boat_length?: number
  }
}

interface ApplicationForm {
  // Boat Owner Information
  owner_names: string
  owner_email: string
  owner_mailing_address: string
  owner_phone_numbers: string
  owner_drivers_license: string
  owner_drivers_license_state: string
  vehicle_license_plates: string
  boat_operators: string
  
  // Boat Information
  boat_name: string
  boat_make: string
  boat_model: string
  boat_year: number
  boat_length: number
  boat_draft: number
  boat_beam: number
  boat_registration_number: string
  
  // Rate Information
  cost_per_foot: number
  monthly_taxes: number
  total_monthly_cost: number
  slip_number: string
  primary_payment_method: 'ACH' | 'Credit Card'
  starting_date: string
  estimated_end_date: string
  
  // Payment Information
  bank_name?: string
  account_holder_name?: string
  account_number?: string
  routing_number?: string
  account_type?: 'Checking' | 'Savings'
  card_last_four?: string
  card_brand?: string
  card_expiry_month?: number
  card_expiry_year?: number
}

export default function OnboardingApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const offerId = params.offerId as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [password, setPassword] = useState("")
  const [slipOffer, setSlipOffer] = useState<SlipOffer | null>(null)
  
  const [formData, setFormData] = useState<ApplicationForm>({
    // Boat Owner Information
    owner_names: "",
    owner_email: "",
    owner_mailing_address: "",
    owner_phone_numbers: "",
    owner_drivers_license: "",
    owner_drivers_license_state: "",
    vehicle_license_plates: "",
    boat_operators: "",
    
    // Boat Information
    boat_name: "",
    boat_make: "",
    boat_model: "",
    boat_year: new Date().getFullYear(),
    boat_length: 0,
    boat_draft: 0,
    boat_beam: 0,
    boat_registration_number: "",
    
    // Rate Information
    cost_per_foot: 0,
    monthly_taxes: 0,
    total_monthly_cost: 0,
    slip_number: "",
    primary_payment_method: 'ACH',
    starting_date: "",
    estimated_end_date: "",
    
    // Payment Information
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    routing_number: "",
    account_type: 'Checking',
    card_last_four: "",
    card_brand: "",
    card_expiry_month: 1,
    card_expiry_year: new Date().getFullYear()
  })

  // Fetch slip offer details
  useEffect(() => {
    if (offerId) {
      fetchSlipOffer()
    }
  }, [offerId])

  const fetchSlipOffer = async () => {
    try {
      const supabase = createClient()
      
      const { data: offer, error } = await supabase
        .from('slip_offers')
        .select(`
          *,
          slip:slip_id(
            slip_number,
            length_capacity,
            beam_capacity
          ),
          waitlist:waitlist_entry_id(
            full_name,
            email,
            phone,
            boat_length
          )
        `)
        .eq('id', offerId)
        .single()

      if (error) throw error

      if (!offer) {
        setError('Slip offer not found')
        return
      }

      // Check if offer is expired
      if (new Date(offer.offer_expires_at) < new Date()) {
        setError('This offer has expired')
        return
      }

      // Check if offer is still valid
      if (offer.status !== 'pending') {
        setError('This offer is no longer valid')
        return
      }

      setSlipOffer(offer)
      
      // Pre-populate form with offer data
      setFormData(prev => ({
        ...prev,
        owner_names: offer.waitlist.full_name,
        owner_email: offer.waitlist.email,
        owner_phone_numbers: offer.waitlist.phone || "",
        boat_length: offer.waitlist.boat_length || 0,
        cost_per_foot: offer.offered_price_per_foot,
        monthly_taxes: offer.total_monthly_cost * 0.07,
        total_monthly_cost: offer.total_monthly_cost,
        slip_number: offer.slip.slip_number
      }))

    } catch (error) {
      console.error('Error fetching slip offer:', error)
      setError('Failed to load slip offer details')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPassword = async () => {
    if (!password.trim()) {
      setError('Please enter the password')
      return
    }

    try {
      const supabase = createClient()
      
      const { data: offer, error } = await supabase
        .from('slip_offers')
        .select('offer_password')
        .eq('id', offerId)
        .eq('offer_password', password.trim())
        .single()

      if (error || !offer) {
        setError('Invalid password. Please check your email for the correct password.')
        return
      }

      setIsAuthenticated(true)
      setError(null)
    } catch (error) {
      console.error('Error verifying password:', error)
      setError('Failed to verify password. Please try again.')
    }
  }

  const handleInputChange = (field: keyof ApplicationForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      const requiredFields = [
        'owner_names', 'owner_email', 'owner_mailing_address', 'owner_phone_numbers',
        'owner_drivers_license', 'owner_drivers_license_state', 'boat_make', 'boat_model',
        'boat_year', 'boat_length', 'boat_registration_number', 'starting_date'
      ]

      for (const field of requiredFields) {
        if (!formData[field as keyof ApplicationForm]) {
          throw new Error(`${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`)
        }
      }

      // Validate payment method specific fields
      if (formData.primary_payment_method === 'ACH') {
        if (!formData.bank_name || !formData.account_holder_name || !formData.account_number || !formData.routing_number) {
          throw new Error('All ACH payment fields are required')
        }
      } else if (formData.primary_payment_method === 'Credit Card') {
        if (!formData.card_last_four || !formData.card_brand || !formData.card_expiry_month || !formData.card_expiry_year) {
          throw new Error('All credit card payment fields are required')
        }
      }

      const supabase = createClient()

      // Create occupant application
      const { data: application, error: applicationError } = await supabase
        .from('occupant_applications')
        .insert({
          slip_offer_id: offerId,
          waitlist_entry_id: slipOffer?.waitlist_entry_id,
          slip_id: slipOffer?.slip_id,
          owner_names: formData.owner_names,
          owner_email: formData.owner_email,
          owner_mailing_address: formData.owner_mailing_address,
          owner_phone_numbers: formData.owner_phone_numbers,
          owner_drivers_license: formData.owner_drivers_license,
          owner_drivers_license_state: formData.owner_drivers_license_state,
          vehicle_license_plates: formData.vehicle_license_plates,
          boat_operators: formData.boat_operators,
          boat_name: formData.boat_name,
          boat_make: formData.boat_make,
          boat_model: formData.boat_model,
          boat_year: formData.boat_year,
          boat_length: formData.boat_length,
          boat_draft: formData.boat_draft,
          boat_beam: formData.boat_beam,
          boat_registration_number: formData.boat_registration_number,
          cost_per_foot: formData.cost_per_foot,
          monthly_taxes: formData.monthly_taxes,
          total_monthly_cost: formData.total_monthly_cost,
          slip_number: formData.slip_number,
          primary_payment_method: formData.primary_payment_method,
          starting_date: formData.starting_date,
          estimated_end_date: formData.estimated_end_date || null
        })
        .select()
        .single()

      if (applicationError) throw applicationError

      // Create payment method
      const { error: paymentError } = await supabase
        .from('payment_methods')
        .insert({
          occupant_application_id: application.id,
          payment_type: formData.primary_payment_method,
          bank_name: formData.bank_name || null,
          account_holder_name: formData.account_holder_name || null,
          account_number_encrypted: formData.account_number || null, // In production, encrypt this
          routing_number_encrypted: formData.routing_number || null, // In production, encrypt this
          account_type: formData.account_type || null,
          card_last_four: formData.card_last_four || null,
          card_brand: formData.card_brand || null,
          card_expiry_month: formData.card_expiry_month || null,
          card_expiry_year: formData.card_expiry_year || null,
          is_default: true,
          is_active: true
        })

      if (paymentError) throw paymentError

      // Update slip offer status
      const { error: updateError } = await supabase
        .rpc('transition_to_pending_occupant', { p_slip_offer_id: offerId })

      if (updateError) throw updateError

      setSuccess(true)
      
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push('/onboarding/success')
      }, 5000)

    } catch (error) {
      console.error('Error submitting application:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading application form...</p>
        </div>
      </div>
    )
  }

  if (!slipOffer) {
    return (
      <div className="min-h-screen bg-background">
        <MarinaHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Offer Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </div>
        <MarinaFooter />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <MarinaHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Secure Application Form</CardTitle>
                <p className="text-muted-foreground">
                  Enter the password from your slip offer email to access the application form.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      onKeyPress={(e) => e.key === 'Enter' && verifyPassword()}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={verifyPassword} 
                    className="w-full"
                    disabled={!password.trim()}
                  >
                    Access Application Form
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Offer Details</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div><strong>Slip:</strong> {slipOffer.slip.slip_number}</div>
                    <div><strong>Boat Length:</strong> {slipOffer.slip.length_capacity}' × {slipOffer.slip.beam_capacity}'</div>
                    <div><strong>Monthly Cost:</strong> ${slipOffer.total_monthly_cost.toFixed(2)}</div>
                    <div><strong>Expires:</strong> {new Date(slipOffer.offer_expires_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <MarinaFooter />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <MarinaHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for submitting your application for Slip {slipOffer.slip.slip_number}. 
              Our team will review your information and contact you within 24-48 hours.
            </p>
            <div className="bg-green-50 p-6 rounded-lg text-left">
              <h3 className="font-semibold text-green-800 mb-3">What happens next?</h3>
              <ul className="text-green-700 space-y-2">
                <li>• We'll review your application and verify all documents</li>
                <li>• You'll receive a confirmation email with next steps</li>
                <li>• Our team will contact you to schedule your arrival</li>
                <li>• Welcome to Marina By-The-Sea!</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              You will be redirected to the home page in a few seconds...
            </p>
          </div>
        </div>
        <MarinaFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Slip Application - {slipOffer.slip.slip_number}
            </h1>
            <p className="text-muted-foreground">
              Complete your application to secure your slip at Marina By-The-Sea
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Boat Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Boat Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner_names">Full Name(s) *</Label>
                    <Input
                      id="owner_names"
                      value={formData.owner_names}
                      onChange={(e) => handleInputChange('owner_names', e.target.value)}
                      placeholder="Enter full name(s)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_email">Email Address *</Label>
                    <Input
                      id="owner_email"
                      type="email"
                      value={formData.owner_email}
                      onChange={(e) => handleInputChange('owner_email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="owner_mailing_address">Mailing Address *</Label>
                  <Textarea
                    id="owner_mailing_address"
                    value={formData.owner_mailing_address}
                    onChange={(e) => handleInputChange('owner_mailing_address', e.target.value)}
                    placeholder="Enter your complete mailing address"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner_phone_numbers">Phone Number(s) *</Label>
                    <Input
                      id="owner_phone_numbers"
                      value={formData.owner_phone_numbers}
                      onChange={(e) => handleInputChange('owner_phone_numbers', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner_drivers_license">Driver's License Number *</Label>
                    <Input
                      id="owner_drivers_license"
                      value={formData.owner_drivers_license}
                      onChange={(e) => handleInputChange('owner_drivers_license', e.target.value)}
                      placeholder="Enter driver's license number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner_drivers_license_state">Driver's License State *</Label>
                    <Select
                      value={formData.owner_drivers_license_state}
                      onValueChange={(value) => handleInputChange('owner_drivers_license_state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="vehicle_license_plates">Vehicle License Plate(s)</Label>
                    <Input
                      id="vehicle_license_plates"
                      value={formData.vehicle_license_plates}
                      onChange={(e) => handleInputChange('vehicle_license_plates', e.target.value)}
                      placeholder="Enter license plate numbers"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="boat_operators">Additional Boat Operators</Label>
                  <Textarea
                    id="boat_operators"
                    value={formData.boat_operators}
                    onChange={(e) => handleInputChange('boat_operators', e.target.value)}
                    placeholder="List names of other people who will operate the boat"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Boat Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Boat Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="boat_name">Boat Name</Label>
                    <Input
                      id="boat_name"
                      value={formData.boat_name}
                      onChange={(e) => handleInputChange('boat_name', e.target.value)}
                      placeholder="Enter boat name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="boat_make">Boat Make *</Label>
                    <Input
                      id="boat_make"
                      value={formData.boat_make}
                      onChange={(e) => handleInputChange('boat_make', e.target.value)}
                      placeholder="e.g., Sea Ray, Beneteau"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="boat_model">Boat Model *</Label>
                    <Input
                      id="boat_model"
                      value={formData.boat_model}
                      onChange={(e) => handleInputChange('boat_model', e.target.value)}
                      placeholder="e.g., Sundancer, Oceanis"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="boat_year">Year *</Label>
                    <Input
                      id="boat_year"
                      type="number"
                      value={formData.boat_year}
                      onChange={(e) => handleInputChange('boat_year', parseInt(e.target.value))}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="boat_length">Length (ft) *</Label>
                    <Input
                      id="boat_length"
                      type="number"
                      value={formData.boat_length}
                      onChange={(e) => handleInputChange('boat_length', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="boat_draft">Draft (ft)</Label>
                    <Input
                      id="boat_draft"
                      type="number"
                      value={formData.boat_draft}
                      onChange={(e) => handleInputChange('boat_draft', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="boat_beam">Beam (ft)</Label>
                    <Input
                      id="boat_beam"
                      type="number"
                      value={formData.boat_beam}
                      onChange={(e) => handleInputChange('boat_beam', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="boat_registration_number">Boat Registration Number *</Label>
                  <Input
                    id="boat_registration_number"
                    value={formData.boat_registration_number}
                    onChange={(e) => handleInputChange('boat_registration_number', e.target.value)}
                    placeholder="Enter official boat registration number"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cost_per_foot">Cost Per Foot</Label>
                    <Input
                      id="cost_per_foot"
                      type="number"
                      value={formData.cost_per_foot}
                      onChange={(e) => handleInputChange('cost_per_foot', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly_taxes">Monthly Taxes (7%)</Label>
                    <Input
                      id="monthly_taxes"
                      type="number"
                      value={formData.monthly_taxes}
                      onChange={(e) => handleInputChange('monthly_taxes', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_monthly_cost">Total Monthly Cost</Label>
                    <Input
                      id="total_monthly_cost"
                      type="number"
                      value={formData.total_monthly_cost}
                      onChange={(e) => handleInputChange('total_monthly_cost', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="slip_number">Slip Number</Label>
                    <Input
                      id="slip_number"
                      value={formData.slip_number}
                      onChange={(e) => handleInputChange('slip_number', e.target.value)}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="starting_date">Starting Date *</Label>
                    <Input
                      id="starting_date"
                      type="date"
                      value={formData.starting_date}
                      onChange={(e) => handleInputChange('starting_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated_end_date">Estimated End Date</Label>
                    <Input
                      id="estimated_end_date"
                      type="date"
                      value={formData.estimated_end_date}
                      onChange={(e) => handleInputChange('estimated_end_date', e.target.value)}
                      min={formData.starting_date || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary_payment_method">Primary Payment Method *</Label>
                  <Select
                    value={formData.primary_payment_method}
                    onValueChange={(value: 'ACH' | 'Credit Card') => handleInputChange('primary_payment_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACH">ACH (Bank Transfer)</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.primary_payment_method === 'ACH' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank_name">Bank Name *</Label>
                        <Input
                          id="bank_name"
                          value={formData.bank_name}
                          onChange={(e) => handleInputChange('bank_name', e.target.value)}
                          placeholder="Enter bank name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                        <Input
                          id="account_holder_name"
                          value={formData.account_holder_name}
                          onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                          placeholder="Enter account holder name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="account_number">Account Number *</Label>
                        <Input
                          id="account_number"
                          value={formData.account_number}
                          onChange={(e) => handleInputChange('account_number', e.target.value)}
                          placeholder="Enter account number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="routing_number">Routing Number *</Label>
                        <Input
                          id="routing_number"
                          value={formData.routing_number}
                          onChange={(e) => handleInputChange('routing_number', e.target.value)}
                          placeholder="Enter routing number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="account_type">Account Type *</Label>
                        <Select
                          value={formData.account_type}
                          onValueChange={(value: 'Checking' | 'Savings') => handleInputChange('account_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Checking">Checking</SelectItem>
                            <SelectItem value="Savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="card_last_four">Last 4 Digits *</Label>
                        <Input
                          id="card_last_four"
                          value={formData.card_last_four}
                          onChange={(e) => handleInputChange('card_last_four', e.target.value)}
                          placeholder="1234"
                          maxLength={4}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="card_brand">Card Brand *</Label>
                        <Select
                          value={formData.card_brand}
                          onValueChange={(value) => handleInputChange('card_brand', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select card brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Visa">Visa</SelectItem>
                            <SelectItem value="Mastercard">Mastercard</SelectItem>
                            <SelectItem value="American Express">American Express</SelectItem>
                            <SelectItem value="Discover">Discover</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="card_expiry_month">Expiry Month *</Label>
                        <Select
                          value={formData.card_expiry_month?.toString()}
                          onValueChange={(value) => handleInputChange('card_expiry_month', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={month.toString()}>
                                {month.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="card_expiry_year">Expiry Year *</Label>
                      <Select
                        value={formData.card_expiry_year?.toString()}
                        onValueChange={(value) => handleInputChange('card_expiry_year', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2">
                By submitting this application, you agree to the terms and conditions of your slip offer.
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <MarinaFooter />
    </div>
  )
}
