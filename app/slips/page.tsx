import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Anchor, Wifi, Zap, Droplets, Shield, Car, Fuel, Wrench, Star, Cable, Waves } from "lucide-react"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  description: string
  amenities: string[]
  has_water: boolean
  has_electric: boolean
  electric_amp: number
  has_cable: boolean
  has_wifi: boolean
  has_pump_out: boolean
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  power: Zap,
  water: Droplets,
  wifi: Wifi,
  security: Shield,
  valet: Car,
  fuel: Fuel,
  "pump-out": Wrench,
  concierge: Star,
  cable: Cable,
  electric: Zap,
}

export default async function SlipsPage() {
  const supabase = await createClient()

  const { data: slips, error } = await supabase.from("dock_slips").select("*").order("slip_number")

  if (error) {
    console.error("Error fetching slips:", error)
  }

  const availableSlips = slips?.filter((slip) => slip.is_available) || []
  const unavailableSlips = slips?.filter((slip) => !slip.is_available) || []



  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />

      {/* Hero Section with Real Marina Image */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/marina-overview.jpg"
            alt="Marina By-The-Sea Overview"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              Available Dock Slips
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Choose from our premium selection of dock slips, each designed to provide the ultimate boating experience
              with world-class amenities and services.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{availableSlips.length}</div>
                <div className="text-muted-foreground">Available Slips</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{slips?.length || 0}</div>
                <div className="text-muted-foreground">Total Slips</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">31-80</div>
                <div className="text-muted-foreground">Boat Length (ft)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Slips */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Available Now</h2>
            <p className="text-lg text-muted-foreground">These premium dock slips are ready for immediate occupancy.</p>
          </div>

          {availableSlips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableSlips.map((slip) => (
                <Card
                  key={slip.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary/20"
                >
                  <div className="relative h-48">
                    <Image
                      src="/images/marina-docks-1.jpg"
                      alt={`Dock Slip ${slip.slip_number}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl font-serif">Slip {slip.slip_number}</CardTitle>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${slip.monthly_rate}/mo</span>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {slip.length_capacity}' L × {slip.beam_capacity}' W
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{slip.description}</p>

                                        {/* Utilities & Services */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Utilities & Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {slip.has_water && (
                          <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                            <Droplets className="h-3 w-3" />
                            <span>Fresh Water</span>
                          </div>
                        )}
                        {slip.has_electric && (
                          <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs">
                            <Zap className="h-3 w-3" />
                            <span>{slip.electric_amp}A Electric</span>
                          </div>
                        )}
                        {slip.has_wifi && (
                          <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                            <Wifi className="h-3 w-3" />
                            <span>WiFi</span>
                          </div>
                        )}
                        {slip.has_cable && (
                          <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                            <Cable className="h-3 w-3" />
                            <span>Cable TV</span>
                          </div>
                        )}
                        {slip.has_pump_out && (
                          <div className="flex items-center space-x-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs">
                            <Waves className="h-3 w-3" />
                            <span>Pump Out</span>
                          </div>
                        )}
                        {slip.amenities && slip.amenities.map((amenity: string) => {
                          const IconComponent = amenityIcons[amenity] || Anchor
                          return (
                            <div
                              key={amenity}
                              className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md text-xs"
                            >
                              <IconComponent className="h-3 w-3" />
                              <span className="capitalize">{amenity.replace("-", " ")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link href="/contact">Inquire About This Slip</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
        </div>
      </section>

      {/* Waitlist Section */}
      {unavailableSlips.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Currently Occupied</h2>
              <p className="text-lg text-muted-foreground">
                These slips are currently occupied but you can join our waitlist for future availability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {unavailableSlips.map((slip) => (
                <Card key={slip.id} className="overflow-hidden opacity-75">
                  <div className="relative h-48">
                    <Image
                      src="/images/marina-docks-2.jpg"
                      alt={`Dock Slip ${slip.slip_number}`}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl font-serif">Slip {slip.slip_number}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Occupied
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-muted-foreground">${slip.monthly_rate}/mo</span>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          {slip.length_capacity}' L × {slip.beam_capacity}' W
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{slip.description}</p>

                    {/* Utilities & Services */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Utilities & Services</h4>
                      <div className="flex flex-wrap gap-2 opacity-60">
                        {slip.has_water && (
                          <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                            <Droplets className="h-3 w-3" />
                            <span>Fresh Water</span>
                          </div>
                        )}
                        {slip.has_electric && (
                          <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs">
                            <Zap className="h-3 w-3" />
                            <span>{slip.electric_amp}A Electric</span>
                          </div>
                        )}
                        {slip.has_wifi && (
                          <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                            <Wifi className="h-3 w-3" />
                            <span>WiFi</span>
                          </div>
                        )}
                        {slip.has_cable && (
                          <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                            <Cable className="h-3 w-3" />
                            <span>Cable TV</span>
                          </div>
                        )}
                        {slip.has_pump_out && (
                          <div className="flex items-center space-x-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs">
                            <Waves className="h-3 w-3" />
                            <span>Pump Out</span>
                          </div>
                        )}
                        {slip.amenities && slip.amenities.map((amenity: string) => {
                          const IconComponent = amenityIcons[amenity] || Anchor
                          return (
                            <div
                              key={amenity}
                              className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md text-xs"
                            >
                              <IconComponent className="h-3 w-3" />
                              <span className="capitalize">{amenity.replace("-", " ")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href="/waitlist">Join Waitlist</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-6">Ready to Secure Your Slip?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Don't wait - premium dock slips at Marina By-The-Sea are in high demand. Contact us today to reserve your
            spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
              <Link href="/contact">Contact Us Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarinaFooter />
    </div>
  )
}
