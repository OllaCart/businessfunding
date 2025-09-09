"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Building, User, DollarSign, FileText } from "lucide-react"
import Link from "next/link"

interface FormData {
  // Business Information
  businessName: string
  businessType: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  businessEmail: string
  businessWebsite: string
  yearsInBusiness: string
  numberOfEmployees: string
  annualRevenue: string
  monthlyRevenue: string
  
  // Owner Information
  firstName: string
  lastName: string
  email: string
  phone: string
  ssn: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zip: string
  
  // Loan Information
  loanAmount: string
  loanPurpose: string
  loanProgram: string
  existingDebt: string
  collateral: string
  
  // Additional Information
  creditScore: string
  bankruptcy: boolean
  taxLiens: boolean
  additionalInfo: string
  
  // Terms and Conditions
  agreeToTerms: boolean
  agreeToCreditCheck: boolean
  agreeToMarketing: boolean
}

function LoanApplicationForm() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    yearsInBusiness: "",
    numberOfEmployees: "",
    annualRevenue: "",
    monthlyRevenue: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ssn: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    loanAmount: searchParams.get('amount') || "",
    loanPurpose: "",
    loanProgram: searchParams.get('program') || "",
    existingDebt: "",
    collateral: "",
    creditScore: "",
    bankruptcy: false,
    taxLiens: false,
    additionalInfo: "",
    agreeToTerms: false,
    agreeToCreditCheck: false,
    agreeToMarketing: false,
  })

  const steps = [
    { id: 1, title: "Business Information", icon: Building },
    { id: 2, title: "Owner Information", icon: User },
    { id: 3, title: "Loan Details", icon: DollarSign },
    { id: 4, title: "Review & Submit", icon: FileText },
  ]

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // Redirect to success page
    window.location.href = "/onboarding/success"
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessCity">City *</Label>
                <Input
                  id="businessCity"
                  value={formData.businessCity}
                  onChange={(e) => handleInputChange("businessCity", e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessState">State *</Label>
                <Select value={formData.businessState} onValueChange={(value) => handleInputChange("businessState", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessZip">ZIP Code *</Label>
                <Input
                  id="businessZip"
                  value={formData.businessZip}
                  onChange={(e) => handleInputChange("businessZip", e.target.value)}
                  placeholder="ZIP code"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Business Website</Label>
              <Input
                id="businessWebsite"
                type="url"
                value={formData.businessWebsite}
                onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                <Select value={formData.yearsInBusiness} onValueChange={(value) => handleInputChange("yearsInBusiness", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                    <SelectItem value="4-5">4-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                <Select value={formData.numberOfEmployees} onValueChange={(value) => handleInputChange("numberOfEmployees", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Just me)</SelectItem>
                    <SelectItem value="2-5">2-5</SelectItem>
                    <SelectItem value="6-10">6-10</SelectItem>
                    <SelectItem value="11-25">11-25</SelectItem>
                    <SelectItem value="26-50">26-50</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue *</Label>
                <Select value={formData.annualRevenue} onValueChange={(value) => handleInputChange("annualRevenue", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                    <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                    <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1m+">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security Number *</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  placeholder="ZIP code"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount Requested *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                  placeholder="Enter loan amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanProgram">Loan Program *</Label>
                <Select value={formData.loanProgram} onValueChange={(value) => handleInputChange("loanProgram", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working-capital">Working Capital</SelectItem>
                    <SelectItem value="equipment-financing">Equipment Financing</SelectItem>
                    <SelectItem value="commercial-loan">Commercial Loan</SelectItem>
                    <SelectItem value="sba-loan">SBA Loan</SelectItem>
                    <SelectItem value="term-loan">Term Loan</SelectItem>
                    <SelectItem value="line-of-credit">Line of Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanPurpose">Purpose of Loan *</Label>
              <Textarea
                id="loanPurpose"
                value={formData.loanPurpose}
                onChange={(e) => handleInputChange("loanPurpose", e.target.value)}
                placeholder="Describe how you plan to use the loan funds..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="existingDebt">Existing Business Debt</Label>
                <Input
                  id="existingDebt"
                  type="number"
                  value={formData.existingDebt}
                  onChange={(e) => handleInputChange("existingDebt", e.target.value)}
                  placeholder="Enter total existing debt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collateral">Collateral Available</Label>
                <Input
                  id="collateral"
                  value={formData.collateral}
                  onChange={(e) => handleInputChange("collateral", e.target.value)}
                  placeholder="Describe available collateral"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Estimated Credit Score</Label>
                <Select value={formData.creditScore} onValueChange={(value) => handleInputChange("creditScore", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credit score range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300-579">300-579 (Poor)</SelectItem>
                    <SelectItem value="580-669">580-669 (Fair)</SelectItem>
                    <SelectItem value="670-739">670-739 (Good)</SelectItem>
                    <SelectItem value="740-799">740-799 (Very Good)</SelectItem>
                    <SelectItem value="800-850">800-850 (Excellent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bankruptcy"
                    checked={formData.bankruptcy}
                    onCheckedChange={(checked) => handleInputChange("bankruptcy", checked as boolean)}
                  />
                  <Label htmlFor="bankruptcy">Have you filed for bankruptcy in the past 7 years?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxLiens"
                    checked={formData.taxLiens}
                    onCheckedChange={(checked) => handleInputChange("taxLiens", checked as boolean)}
                  />
                  <Label htmlFor="taxLiens">Do you have any tax liens?</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Any additional information that might help with your application..."
                rows={4}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Review Your Application</h3>
              <p className="text-muted-foreground">Please review all information before submitting your application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.businessName}</p>
                  <p><strong>Type:</strong> {formData.businessType}</p>
                  <p><strong>Address:</strong> {formData.businessAddress}, {formData.businessCity}, {formData.businessState} {formData.businessZip}</p>
                  <p><strong>Phone:</strong> {formData.businessPhone}</p>
                  <p><strong>Email:</strong> {formData.businessEmail}</p>
                  <p><strong>Years in Business:</strong> {formData.yearsInBusiness}</p>
                  <p><strong>Employees:</strong> {formData.numberOfEmployees}</p>
                  <p><strong>Annual Revenue:</strong> {formData.annualRevenue}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                  <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Amount:</strong> ${formData.loanAmount}</p>
                <p><strong>Program:</strong> {formData.loanProgram}</p>
                <p><strong>Purpose:</strong> {formData.loanPurpose}</p>
                {formData.existingDebt && <p><strong>Existing Debt:</strong> ${formData.existingDebt}</p>}
                {formData.collateral && <p><strong>Collateral:</strong> {formData.collateral}</p>}
                {formData.creditScore && <p><strong>Credit Score:</strong> {formData.creditScore}</p>}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  required
                />
                <Label htmlFor="agreeToTerms">
                  I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToCreditCheck"
                  checked={formData.agreeToCreditCheck}
                  onCheckedChange={(checked) => handleInputChange("agreeToCreditCheck", checked as boolean)}
                  required
                />
                <Label htmlFor="agreeToCreditCheck">
                  I authorize Sure Thing Lending to perform a credit check and verify the information provided *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                />
                <Label htmlFor="agreeToMarketing">
                  I agree to receive marketing communications from Sure Thing Lending
                </Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : isCompleted 
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-muted-foreground bg-background text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-muted-foreground'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {steps[currentStep - 1].title}
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center glass-button"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!formData.agreeToTerms || !formData.agreeToCreditCheck}
                        className="flex items-center glass-button"
                      >
                        Submit Application
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BusinessFooter />
    </div>
  )
}

export default function LoanApplicationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoanApplicationForm />
    </Suspense>
  )
}
