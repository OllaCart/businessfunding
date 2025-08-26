import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Anchor, Shield, Fuel, Wrench, Star, ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  slip_type: string
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

const getSlipTypeLabel = (type: string) => {
  switch (type) {
    case "premium":
      return "Premium"
    case "covered":
      return "Covered"
    case "uncovered":
      return "Open"
    default:
      return type
  }
}

function HeroVideoSkeleton() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 animate-pulse" />
  )
}

function HeroVideo() {
  return (
    <Suspense fallback={<HeroVideoSkeleton />}>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/marina-overview.jpg')",
          }}
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/marina-overview.jpg"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dji_fly_0_0_0_1726323726600_video_cache%20%281%29-5ZK1KE1Z9PYRlJKRNDVkeJjkpmbQb2.MOV" type="video/mp4" />
        </video>
      </div>
    </Suspense>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: slips, error } = await supabase.from("dock_slips").select("*").order("slip_number")
  
  if (error) {
    console.error("Error fetching slips:", error)
  }
  
  const availableSlips = slips?.filter((slip) => slip.is_available) || []

  return (
    <div className="min-h-screen">
      <MarinaHeader />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-7xl mb-6 leading-tight animate-fade-in-up">
            Experience Luxury
            <br />
            <span className="text-secondary bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
              By The Sea
            </span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Premium dock slips with world-class amenities, 24/7 security, and exceptional service at Florida's most
            prestigious waterfront marina destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/slips">
                View Available Slips
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>


        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background scroll-mt-16" id="services">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              World-Class Marina Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for the ultimate boating experience, all in one premium location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">24/7 Security</h3>
                <p className="text-muted-foreground">
                  Round-the-clock security monitoring and gated access for complete peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Fuel className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Fuel Dock</h3>
                <p className="text-muted-foreground">
                  Premium fuel services with competitive pricing and convenient dock-side delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Full Service</h3>
                <p className="text-muted-foreground">
                  Professional maintenance, repairs, and detailing services by certified technicians.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Concierge</h3>
                <p className="text-muted-foreground">
                  Personalized concierge services including provisioning, cleaning, and valet parking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Slips Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Premium Dock Slips Available
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our currently available slips with real-time availability and pricing.
            </p>
          </div>

          {/* Horizontally Scrollable Slips */}
          <div className="mb-12">
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {availableSlips.map((slip) => (
                <Card key={slip.id} className="min-w-[320px] max-w-[320px] overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center relative">
                    <Anchor className="h-16 w-16 text-primary" />
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      Available
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-semibold text-lg">Slip {slip.slip_number}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getSlipTypeLabel(slip.slip_type)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{slip.length_capacity}' × {slip.beam_capacity}'</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Rate:</span>
                        <span className="font-bold text-primary">${slip.monthly_rate.toLocaleString()}</span>
                      </div>
                    </div>

                    {slip.amenities && slip.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {slip.amenities.slice(0, 4).map((amenity: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/slips">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/slips">
                View All Available Slips
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      <MarinaFooter />
    </div>
  )
}
