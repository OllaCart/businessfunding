import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { DollarSign, Clock, TrendingUp, Building, Wrench, CheckCircle, ArrowRight } from "lucide-react"

// Force dynamic rendering to prevent static generation issues with Supabase server client
export const dynamic = 'force-dynamic'

interface LoanProgram {
  id: string
  program_name: string
  loan_type: string
  min_amount: number
  max_amount: number
  interest_rate_min: number
  interest_rate_max: number
  term_length_min: number
  term_length_max: number
  is_available: boolean
  description: string
  requirements: string[]
  processing_time: string
  collateral_required: boolean
  credit_score_min: number
  show_rates: boolean
}

const loanTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'working capital': TrendingUp,
  'equipment financing': Wrench,
  'commercial': Building,
  'sba': Building,
  'term loan': DollarSign,
  'line of credit': DollarSign,
}

export default async function LoanProgramsPage() {
  const supabase = await createClient()

  const { data: programs, error } = await supabase.from("loan_programs").select("*").order("program_name", { ascending: true })

  if (error) {
    console.error("Error fetching loan programs:", error)
  }

  const availablePrograms = programs?.filter((program) => program.is_available) || []
  const unavailablePrograms = programs?.filter((program) => !program.is_available) || []

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/business-hero.jpg"
            alt="Business Funding Solutions"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 glass-hero" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Business Loan Programs
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Choose from our comprehensive selection of business funding programs, each designed to provide the capital your business needs to grow and succeed.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center glass-card">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{availablePrograms.length}</div>
                <div className="text-muted-foreground">Available Programs</div>
              </CardContent>
            </Card>
            <Card className="text-center glass-card">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{programs?.length || 0}</div>
                <div className="text-muted-foreground">Total Programs</div>
              </CardContent>
            </Card>
            <Card className="text-center glass-card">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">$10K-$5M</div>
                <div className="text-muted-foreground">Loan Amount Range</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Programs */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Available Now</h2>
            <p className="text-lg text-muted-foreground">These business funding programs are ready for immediate application.</p>
          </div>

          {availablePrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availablePrograms.map((program) => {
                const IconComponent = loanTypeIcons[program.loan_type.toLowerCase()] || DollarSign
                return (
                  <Card
                    key={program.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary/20 glass-card"
                  >
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl font-serif">{program.program_name}</CardTitle>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        {program.show_rates ? (
                          <span className="text-2xl font-bold text-primary">{program.interest_rate_min}% - {program.interest_rate_max}% APR</span>
                        ) : (
                          <span className="text-lg text-muted-foreground">Rate upon application</span>
                        )}
                        <div className="text-sm text-muted-foreground">
                          <div>
                            {formatAmount(program.min_amount)} - {formatAmount(program.max_amount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">{program.description}</p>

                      {/* Program Details */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Program Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Term Length</span>
                            <span className="font-medium">{program.term_length_min} - {program.term_length_max} months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="font-medium">{program.processing_time}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min Credit Score</span>
                            <span className="font-medium">{program.credit_score_min}+</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Collateral Required</span>
                            <span className="font-medium">{program.collateral_required ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>

                      {program.requirements && program.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                          <div className="space-y-1">
                            {program.requirements.slice(0, 3).map((requirement, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span className="text-muted-foreground">{requirement}</span>
                              </div>
                            ))}
                            {program.requirements.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{program.requirements.length - 3} more requirements
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button asChild className="w-full glass-button">
                          <Link href={`/onboarding/apply?program=${program.id}&programName=${program.program_name}&type=${program.loan_type}`}>
                            Apply for This Program
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-12 glass-card">
              <CardContent>
                <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Available Programs</h3>
                <p className="text-muted-foreground mb-6">
                  All our loan programs are currently at capacity. Join our waitlist to be notified when new funding becomes available.
                </p>
                <Button asChild className="glass-button">
                  <Link href="/waitlist">Join Waitlist</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Waitlist Section */}
      {unavailablePrograms.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Currently At Capacity</h2>
              <p className="text-lg text-muted-foreground">
                These programs are currently at capacity but you can join our waitlist for future availability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {unavailablePrograms.map((program) => {
                const IconComponent = loanTypeIcons[program.loan_type.toLowerCase()] || DollarSign
                return (
                  <Card key={program.id} className="overflow-hidden opacity-75 glass-card">
                    <div className="relative h-48">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 grayscale" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl font-serif">{program.program_name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            At Capacity
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {program.show_rates ? (
                          <span className="text-2xl font-bold text-muted-foreground">{program.interest_rate_min}% - {program.interest_rate_max}% APR</span>
                        ) : (
                          <span className="text-lg text-muted-foreground">Rate upon application</span>
                        )}
                        <div className="text-sm text-muted-foreground">
                          <div>
                            {formatAmount(program.min_amount)} - {formatAmount(program.max_amount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">{program.description}</p>

                      <div className="pt-2 space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/waitlist?programs=${program.id}`}>Join Waitlist for This Program</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-6">Ready to Get Funded?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Don't wait - business funding opportunities are limited. Apply today to secure the capital your business needs to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white hover:bg-white/90 text-primary">
              <Link href="/onboarding/apply">Apply Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Speak with an Expert</Link>
            </Button>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}
