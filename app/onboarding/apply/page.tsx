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
import { ArrowLeft, ArrowRight, Building, User, DollarSign, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn: string
  email: string
  mobilePhone: string
  
  // Business Information
  legalCompanyName: string
  businessStartDate: string
  industry: string
  stateOfIncorporation: string
  taxId: string
  companyWebsite: string
  hasWebsite: boolean
  businessPhone: string
  businessAddress1: string
  businessAddress2: string
  businessCity: string
  businessState: string
  businessZip: string
  
  // Loan Information
  amountRequested: string
  numberOfEmployees: string
  entityType: string
  ficoScore: string
  ownershipPercentage: string
  
  // Partner Information (if ownership < 90%)
  partnerOwnershipPercentage: string
  partnerFirstName: string
  partnerLastName: string
  partnerDateOfBirth: string
  partnerSsn: string
  partnerBusinessEmail: string
  partnerMobilePhone: string
  partnerFicoScore: string
  
  // Business Questions
  processesCreditCards: boolean
  banks: string
  hasBusinessDebt: boolean
  timeConstraints: string
  hasMultipleBusinesses: boolean
  isHomeBased: boolean
  hasCpa: boolean
  hasOutstandingTaxDebt: boolean
  
  // Consent
  consentToCommunications: boolean
  agreeToTerms: boolean
  agreeToCreditCheck: boolean
  agreeToMarketing: boolean
}

function LoanApplicationForm() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    email: "",
    mobilePhone: "",
    legalCompanyName: "",
    businessStartDate: "",
    industry: "",
    stateOfIncorporation: "",
    taxId: "",
    companyWebsite: "",
    hasWebsite: false,
    businessPhone: "",
    businessAddress1: "",
    businessAddress2: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    amountRequested: searchParams.get('amount') || "",
    numberOfEmployees: "",
    entityType: "",
    ficoScore: "",
    ownershipPercentage: "",
    partnerOwnershipPercentage: "",
    partnerFirstName: "",
    partnerLastName: "",
    partnerDateOfBirth: "",
    partnerSsn: "",
    partnerBusinessEmail: "",
    partnerMobilePhone: "",
    partnerFicoScore: "",
    processesCreditCards: false,
    banks: "",
    hasBusinessDebt: false,
    timeConstraints: "",
    hasMultipleBusinesses: false,
    isHomeBased: false,
    hasCpa: false,
    hasOutstandingTaxDebt: false,
    consentToCommunications: false,
    agreeToTerms: false,
    agreeToCreditCheck: false,
    agreeToMarketing: false,
  })

  const steps = [
    { id: 1, title: "Personal Information", icon: User },
    { id: 2, title: "Business Information", icon: Building },
    { id: 3, title: "Loan Details", icon: DollarSign },
    { id: 4, title: "Business Questions", icon: FileText },
    { id: 5, title: "Review & Submit", icon: CheckCircle },
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
    console.log("Form submitted:", formData)
    window.location.href = "/onboarding/success"
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Personal Information</h3>
              <p className="text-muted-foreground">Tell us about yourself</p>
            </div>
            
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
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">SSN/NIN *</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="mobilePhone">Mobile Phone *</Label>
                <Input
                  id="mobilePhone"
                  type="tel"
                  value={formData.mobilePhone}
                  onChange={(e) => handleInputChange("mobilePhone", e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Business Information</h3>
              <p className="text-muted-foreground">Tell us about your business</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalCompanyName">Legal Company Name *</Label>
              <Input
                id="legalCompanyName"
                value={formData.legalCompanyName}
                onChange={(e) => handleInputChange("legalCompanyName", e.target.value)}
                placeholder="Enter your company's legal name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessStartDate">Business Start Date *</Label>
                <Input
                  id="businessStartDate"
                  type="date"
                  value={formData.businessStartDate}
                  onChange={(e) => handleInputChange("businessStartDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="professional-services">Professional Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stateOfIncorporation">State of Incorporation *</Label>
                <Select value={formData.stateOfIncorporation} onValueChange={(value) => handleInputChange("stateOfIncorporation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / Company Number *</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="XX-XXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <div className="space-y-2">
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                  placeholder="https://www.example.com"
                  disabled={formData.hasWebsite}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWebsite"
                    checked={formData.hasWebsite}
                    onCheckedChange={(checked) => handleInputChange("hasWebsite", checked as boolean)}
                  />
                  <Label htmlFor="hasWebsite">This business does not have a website</Label>
                </div>
              </div>
            </div>

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
              <Label htmlFor="businessAddress1">Business Address Line 1 *</Label>
              <Input
                id="businessAddress1"
                value={formData.businessAddress1}
                onChange={(e) => handleInputChange("businessAddress1", e.target.value)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress2">Business Address Line 2</Label>
              <Input
                id="businessAddress2"
                value={formData.businessAddress2}
                onChange={(e) => handleInputChange("businessAddress2", e.target.value)}
                placeholder="Suite, unit, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessCity">Business City *</Label>
                <Input
                  id="businessCity"
                  value={formData.businessCity}
                  onChange={(e) => handleInputChange("businessCity", e.target.value)}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessState">Business State *</Label>
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessZip">Business Zip *</Label>
                <Input
                  id="businessZip"
                  value={formData.businessZip}
                  onChange={(e) => handleInputChange("businessZip", e.target.value)}
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
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Loan Details</h3>
              <p className="text-muted-foreground">Tell us about your funding needs</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountRequested">Amount Requested *</Label>
              <Input
                id="amountRequested"
                type="number"
                value={formData.amountRequested}
                onChange={(e) => handleInputChange("amountRequested", e.target.value)}
                placeholder="Enter loan amount"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="entityType">Entity Type *</Label>
                <Select value={formData.entityType} onValueChange={(value) => handleInputChange("entityType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ficoScore">FICO Score *</Label>
                <Select value={formData.ficoScore} onValueChange={(value) => handleInputChange("ficoScore", value)}>
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
              <div className="space-y-2">
                <Label htmlFor="ownershipPercentage">Ownership % *</Label>
                <Input
                  id="ownershipPercentage"
                  type="number"
                  value={formData.ownershipPercentage}
                  onChange={(e) => handleInputChange("ownershipPercentage", e.target.value)}
                  placeholder="Enter ownership percentage"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            {parseInt(formData.ownershipPercentage) < 90 && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Partner Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="partnerOwnershipPercentage">Partner Ownership % *</Label>
                    <Input
                      id="partnerOwnershipPercentage"
                      type="number"
                      value={formData.partnerOwnershipPercentage}
                      onChange={(e) => handleInputChange("partnerOwnershipPercentage", e.target.value)}
                      placeholder="Enter partner ownership percentage"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerFirstName">Partner First Name *</Label>
                    <Input
                      id="partnerFirstName"
                      value={formData.partnerFirstName}
                      onChange={(e) => handleInputChange("partnerFirstName", e.target.value)}
                      placeholder="Partner's first name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerLastName">Partner Last Name *</Label>
                    <Input
                      id="partnerLastName"
                      value={formData.partnerLastName}
                      onChange={(e) => handleInputChange("partnerLastName", e.target.value)}
                      placeholder="Partner's last name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerDateOfBirth">Partner Date of Birth *</Label>
                    <Input
                      id="partnerDateOfBirth"
                      type="date"
                      value={formData.partnerDateOfBirth}
                      onChange={(e) => handleInputChange("partnerDateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerSsn">Partner SSN/NIN *</Label>
                    <Input
                      id="partnerSsn"
                      value={formData.partnerSsn}
                      onChange={(e) => handleInputChange("partnerSsn", e.target.value)}
                      placeholder="XXX-XX-XXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerBusinessEmail">Partner Business Email *</Label>
                    <Input
                      id="partnerBusinessEmail"
                      type="email"
                      value={formData.partnerBusinessEmail}
                      onChange={(e) => handleInputChange("partnerBusinessEmail", e.target.value)}
                      placeholder="partner@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerMobilePhone">Partner Mobile Phone *</Label>
                    <Input
                      id="partnerMobilePhone"
                      type="tel"
                      value={formData.partnerMobilePhone}
                      onChange={(e) => handleInputChange("partnerMobilePhone", e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerFicoScore">Partner FICO Score *</Label>
                    <Select value={formData.partnerFicoScore} onValueChange={(value) => handleInputChange("partnerFicoScore", value)}>
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
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Business Questions</h3>
              <p className="text-muted-foreground">Help us understand your business better</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="processesCreditCards"
                  checked={formData.processesCreditCards}
                  onCheckedChange={(checked) => handleInputChange("processesCreditCards", checked as boolean)}
                />
                <Label htmlFor="processesCreditCards">Do you process credit cards?</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banks">Which banks do you have business accounts at?</Label>
                <Input
                  id="banks"
                  value={formData.banks}
                  onChange={(e) => handleInputChange("banks", e.target.value)}
                  placeholder="List your business banks"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBusinessDebt"
                  checked={formData.hasBusinessDebt}
                  onCheckedChange={(checked) => handleInputChange("hasBusinessDebt", checked as boolean)}
                />
                <Label htmlFor="hasBusinessDebt">Do you have business debt?</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeConstraints">Do you have any time constraints?</Label>
                <Textarea
                  id="timeConstraints"
                  value={formData.timeConstraints}
                  onChange={(e) => handleInputChange("timeConstraints", e.target.value)}
                  placeholder="Describe any time constraints..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasMultipleBusinesses"
                  checked={formData.hasMultipleBusinesses}
                  onCheckedChange={(checked) => handleInputChange("hasMultipleBusinesses", checked as boolean)}
                />
                <Label htmlFor="hasMultipleBusinesses">Do you own multiple businesses?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHomeBased"
                  checked={formData.isHomeBased}
                  onCheckedChange={(checked) => handleInputChange("isHomeBased", checked as boolean)}
                />
                <Label htmlFor="isHomeBased">Are you home based?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCpa"
                  checked={formData.hasCpa}
                  onCheckedChange={(checked) => handleInputChange("hasCpa", checked as boolean)}
                />
                <Label htmlFor="hasCpa">Do you have a CPA?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOutstandingTaxDebt"
                  checked={formData.hasOutstandingTaxDebt}
                  onCheckedChange={(checked) => handleInputChange("hasOutstandingTaxDebt", checked as boolean)}
                />
                <Label htmlFor="hasOutstandingTaxDebt">Do you have outstanding tax debt?</Label>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Review Your Application</h3>
              <p className="text-muted-foreground">Please review all information before submitting</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.mobilePhone}</p>
                  <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Company:</strong> {formData.legalCompanyName}</p>
                  <p><strong>Industry:</strong> {formData.industry}</p>
                  <p><strong>Start Date:</strong> {formData.businessStartDate}</p>
                  <p><strong>Employees:</strong> {formData.numberOfEmployees}</p>
                  <p><strong>Entity Type:</strong> {formData.entityType}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Amount Requested:</strong> ${formData.amountRequested}</p>
                  <p><strong>FICO Score:</strong> {formData.ficoScore}</p>
                  <p><strong>Ownership %:</strong> {formData.ownershipPercentage}%</p>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Required Documentation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>EIN Letter/Operating Agreement/Articles of Organization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>3 Months business bank statements (all accounts)</span>
                  </div>
                  {parseInt(formData.amountRequested) > 50000 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>YTD Profit and Loss</span>
                    </div>
                  )}
                  {parseInt(formData.amountRequested) > 150000 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Business Tax Returns & Balance Sheet</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Personal Financial Statement</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentToCommunications"
                    checked={formData.consentToCommunications}
                    onCheckedChange={(checked) => handleInputChange("consentToCommunications", checked as boolean)}
                    required
                  />
                  <Label htmlFor="consentToCommunications" className="text-sm">
                    <strong>Consent to Communications:</strong> By providing your contact information and signing below, you authorize Unbeatable Loans and its representatives, successors, assigns, and designees to communicate with you via phone calls, text messages, and emails, including automated technology and pre-recorded messages, for informational, marketing, or transactional purposes. Standard message and data rates may apply. You may opt-out at any time by replying "STOP" to text messages, unsubscribing from emails, or contacting us directly. You further authorize Unbeatable Loans and its designees to obtain consumer, personal, business, and investigative reports about you from consumer reporting agencies (including TransUnion, Experian, Equifax, and Identity IQ), banks, creditors, government agencies, and other third parties (collectively, the "Recipients"). Unbeatable Loans may transmit this application form, along with any information obtained in connection with it, to any or all Recipients for purposes related to commercial loans or purchases of future receivables (collectively, "Transactions"). You also consent to the release, by any creditor or financial institution, of any information relating to you, to Unbeatable Loans and each of the Recipients. Unbeatable Loans is authorized to communicate with the Recipients on your behalf and represent you in matters related to the Transactions. Your information will be handled in accordance with our Terms of Use and Privacy Policy. *
                  </Label>
                </div>

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
                        disabled={!formData.consentToCommunications || !formData.agreeToTerms || !formData.agreeToCreditCheck}
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