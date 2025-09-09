"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, ArrowRight, Clock, TrendingUp, Building, Wrench } from "lucide-react"
import { createPublicClient } from "@/lib/supabase/public"

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
  show_rates: boolean
  description: string
  requirements: string[]
  processing_time: string
  collateral_required: boolean
  credit_score_min: number
}

export function DynamicLoanProgramsSection() {
  const [availablePrograms, setAvailablePrograms] = useState<LoanProgram[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLoanPrograms()
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchLoanPrograms, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchLoanPrograms = async () => {
    try {
      const supabase = createPublicClient()
      const { data: programs, error } = await supabase.from("loan_programs").select("*").order("program_name", { ascending: true })
      
      if (error) {
        console.error("Error fetching loan programs:", error)
        setAvailablePrograms([])
      } else if (programs) {
        const available = programs.filter(program => program.is_available)
        setAvailablePrograms(available)
      }
    } catch (error) {
      console.error("Failed to fetch loan programs:", error)
      setAvailablePrograms([])
    } finally {
      setLoading(false)
    }
  }

  const getLoanTypeIcon = (loanType: string) => {
    switch (loanType.toLowerCase()) {
      case 'working capital':
        return TrendingUp
      case 'equipment financing':
        return Wrench
      case 'commercial':
        return Building
      default:
        return DollarSign
    }
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  if (loading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Available Loan Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              Loading available programs...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse glass-card">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Available Loan Programs
          </h2>
          <p className="text-lg text-muted-foreground">
            {availablePrograms.length > 0 
              ? `Currently ${availablePrograms.length} program${availablePrograms.length === 1 ? '' : 's'} available`
              : "All programs are currently at capacity. Join our waitlist for future availability."
            }
          </p>
        </div>

        {availablePrograms.length > 0 ? (
          availablePrograms.length > 3 ? (
            // Horizontal scroll for many programs
            <div className="mb-8">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {availablePrograms.map((program) => {
                  const IconComponent = getLoanTypeIcon(program.loan_type)
                  return (
                    <Card key={program.id} className="hover:shadow-lg transition-shadow min-w-[350px] flex-shrink-0 glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-lg">{program.program_name}</h3>
                              <p className="text-sm text-muted-foreground">{program.loan_type}</p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Loan Amount</span>
                            <span className="font-medium">{formatAmount(program.min_amount)} - {formatAmount(program.max_amount)}</span>
                          </div>
                          
                          {program.show_rates ? (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Interest Rate</span>
                              <span className="font-bold text-primary">{program.interest_rate_min}% - {program.interest_rate_max}%</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Interest Rate</span>
                              <span className="text-muted-foreground">Upon application</span>
                            </div>
                          )}

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Term Length</span>
                            <span className="font-medium">{program.term_length_min} - {program.term_length_max} months</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="font-medium">{program.processing_time}</span>
                          </div>
                        </div>

                        {program.description && (
                          <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                        )}

                        <div className="space-y-2">
                          <Button asChild variant="outline" className="w-full">
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
            </div>
          ) : (
            // Centered grid for fewer programs
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {availablePrograms.map((program) => {
                  const IconComponent = getLoanTypeIcon(program.loan_type)
                  return (
                    <Card key={program.id} className="hover:shadow-lg transition-shadow glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-lg">{program.program_name}</h3>
                              <p className="text-sm text-muted-foreground">{program.loan_type}</p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Loan Amount</span>
                            <span className="font-medium">{formatAmount(program.min_amount)} - {formatAmount(program.max_amount)}</span>
                          </div>
                          
                          {program.show_rates ? (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Interest Rate</span>
                              <span className="font-bold text-primary">{program.interest_rate_min}% - {program.interest_rate_max}%</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Interest Rate</span>
                              <span className="text-muted-foreground">Upon application</span>
                            </div>
                          )}

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Term Length</span>
                            <span className="font-medium">{program.term_length_min} - {program.term_length_max} months</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="font-medium">{program.processing_time}</span>
                          </div>
                        </div>

                        {program.description && (
                          <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                        )}

                        <div className="space-y-2">
                          <Button asChild variant="outline" className="w-full">
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
            </div>
          )
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

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/loans">
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
