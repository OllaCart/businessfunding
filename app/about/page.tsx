import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Award, Clock, Shield, TrendingUp, DollarSign } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              About Sure Thing Lending
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your trusted partner for business funding solutions. We help businesses grow and succeed with fast, flexible, and competitive loan programs.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-6">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Sure Thing Lending, we believe that every business deserves access to the capital it needs to grow and succeed. 
                  We're not just another lending company – we're your strategic partner in business growth.
                </p>
                <p>
                  Licensed under Unbeatable Loans, we provide fast, flexible, and competitive business funding solutions 
                  tailored to meet the unique needs of small to medium-sized businesses across the United States.
                </p>
                <p>
                  Our streamlined application process and quick approval times mean you can get the funding you need 
                  when you need it most. We understand that time is money, and we're committed to getting you funded quickly.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">Business Funding Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at Sure Thing Lending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Speed</h3>
                <p className="text-muted-foreground">
                  We understand that business opportunities don't wait. Our streamlined process gets you approved 
                  and funded in as little as 24 hours, so you can seize opportunities when they arise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Trust</h3>
                <p className="text-muted-foreground">
                  Licensed under Unbeatable Loans, we maintain the highest standards of integrity and transparency. 
                  Your business success is our success, and we're committed to building long-term partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Growth</h3>
                <p className="text-muted-foreground">
                  We're not just providing loans – we're investing in your business's future. Our flexible terms 
                  and competitive rates are designed to support your growth journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Why Choose Sure Thing Lending?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make business funding simple, fast, and accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">24h</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Approval</h3>
              <p className="text-sm text-muted-foreground">Get approved in as little as 24 hours</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary">$10K</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Flexible Amounts</h3>
              <p className="text-sm text-muted-foreground">From $10,000 to $5,000,000</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">4%</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Competitive Rates</h3>
              <p className="text-sm text-muted-foreground">Starting as low as 4% APR</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-sm text-muted-foreground">Dedicated team to help you succeed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-6">Ready to Get Funded?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of businesses that have trusted Sure Thing Lending for their funding needs. 
            Apply today and get the capital your business needs to grow.
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
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}