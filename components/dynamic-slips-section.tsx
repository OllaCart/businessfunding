"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Anchor, ArrowRight } from "lucide-react"
import { createPublicClient } from "@/lib/supabase/public"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
  description: string
  amenities: string[]
  has_water: boolean
  has_electric: boolean
  electric_amp: number
  has_cable: boolean
  has_wifi: boolean
  has_pump_out: boolean
}

export function DynamicSlipsSection() {
  const [availableSlips, setAvailableSlips] = useState<DockSlip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlips()
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchSlips, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchSlips = async () => {
    try {
      const supabase = createPublicClient()
      const { data: slips, error } = await supabase.from("dock_slips").select("*").order("slip_number")
      
      if (error) {
        console.error("Error fetching slips:", error)
        setAvailableSlips([])
      } else if (slips) {
        const available = slips.filter(slip => slip.is_available)
        setAvailableSlips(available)
      }
    } catch (error) {
      console.error("Failed to fetch slips:", error)
      setAvailableSlips([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Premium Dock Slips Available
            </h2>
            <p className="text-lg text-muted-foreground">
              Loading available slips...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
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
            Premium Dock Slips Available
          </h2>
          <p className="text-lg text-muted-foreground">
            {availableSlips.length > 0 
              ? `Currently ${availableSlips.length} slip${availableSlips.length === 1 ? '' : 's'} available`
              : "All slips are currently occupied. Join our waitlist for future availability."
            }
          </p>
        </div>

        {availableSlips.length > 0 ? (
          availableSlips.length > 3 ? (
            // Horizontal scroll for many slips
            <div className="mb-8">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {availableSlips.map((slip) => (
                  <Card key={slip.id} className="hover:shadow-lg transition-shadow min-w-[320px] flex-shrink-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif font-bold text-xl">Slip {slip.slip_number}</h3>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span className="font-medium">{slip.length_capacity}' L × {slip.beam_capacity}' W</span>
                        </div>
                        
                        {slip.show_price ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Rate</span>
                            <span className="font-bold text-primary">${slip.monthly_rate.toLocaleString()}/mo</span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pricing</span>
                            <span className="text-muted-foreground">Upon request</span>
                          </div>
                        )}
                      </div>

                      {slip.description && (
                        <p className="text-sm text-muted-foreground mb-4">{slip.description}</p>
                      )}

                      <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/contact?slip=${slip.id}&slipNumber=${slip.slip_number}&length=${slip.length_capacity}&beam=${slip.beam_capacity}${slip.show_price ? `&rate=${slip.monthly_rate}` : ''}`}>
                            Inquire About This Slip
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Centered grid for fewer slips
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {availableSlips.map((slip) => (
                  <Card key={slip.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif font-bold text-xl">Slip {slip.slip_number}</h3>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dimensions</span>
                          <span className="font-medium">{slip.length_capacity}' L × {slip.beam_capacity}' W</span>
                        </div>
                        
                        {slip.show_price ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Rate</span>
                            <span className="font-bold text-primary">${slip.monthly_rate.toLocaleString()}/mo</span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pricing</span>
                            <span className="text-muted-foreground">Upon request</span>
                          </div>
                        )}
                      </div>

                      {slip.description && (
                        <p className="text-sm text-muted-foreground mb-4">{slip.description}</p>
                      )}

                      <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/contact?slip=${slip.id}&slipNumber=${slip.slip_number}&length=${slip.length_capacity}&beam=${slip.beam_capacity}${slip.show_price ? `&rate=${slip.monthly_rate}` : ''}`}>
                            Inquire About This Slip
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Anchor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Available Slips</h3>
              <p className="text-muted-foreground mb-6">
                All our premium dock slips are currently occupied. Join our waitlist to be notified when a slip
                becomes available.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/waitlist">Join Waitlist</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/slips">
              View All Slips
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
