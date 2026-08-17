import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Zap, TrendingUp, ArrowRight, DollarSign } from "lucide-react"
import { Suspense } from "react"
// Removed loan programs section - focusing on application flow



function HeroBackgroundSkeleton() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-pulse" />
  )
}

function HeroBackground() {
  return (
    <Suspense fallback={<HeroBackgroundSkeleton />}>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/business-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 glass-hero" />
      </div>
    </Suspense>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <BusinessHeader />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-7xl mb-6 leading-tight animate-fade-in-up">
            Get the Business Funding
            <br />
            <span className="gradient-text">
              You Need to Grow
            </span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Fast approval, competitive rates, and flexible terms. Our business loan programs are designed to help your business thrive with the capital it needs to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Button
              asChild
              size="lg"
              className="glass-button text-primary-foreground hover:text-primary-foreground text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href="/onboarding/apply">
                Apply for Funding
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/loans">View Loan Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background scroll-mt-16" id="services">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Why Choose Sure Thing Lending
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the funding solutions your business needs to grow and succeed with competitive rates and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Fast Approval</h3>
                <p className="text-muted-foreground">
                  Get approved in as little as 24 hours with our streamlined application process and quick decision making.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <DollarSign className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Competitive Rates</h3>
                <p className="text-muted-foreground">
                  Access to competitive interest rates and flexible terms designed to fit your business needs and budget.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Growth Focused</h3>
                <p className="text-muted-foreground">
                  Our loan programs are specifically designed to support business growth, expansion, and operational needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Trusted Partner</h3>
                <p className="text-muted-foreground">
                  Licensed under Unbeatable Loans with a proven track record of helping businesses achieve their financial goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get funded in 3 easy steps - it only takes a few minutes to complete your application
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Apply Online</h3>
                <p className="text-muted-foreground">
                  Complete our simple online application with your business and personal information. 
                  It takes just a few minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Quick Review</h3>
                <p className="text-muted-foreground">
                  Our team reviews your application and may request additional documentation. 
                  We typically respond within 24 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Get Funded</h3>
                <p className="text-muted-foreground">
                  Once approved, funds are typically deposited into your business account 
                  within 1-3 business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join businesses across the country that trust Sure Thing Lending for fast, flexible funding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white hover:bg-white/90 text-primary">
              <Link href="/onboarding/apply">Start Your Application</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Talk to a Specialist</Link>
            </Button>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}
