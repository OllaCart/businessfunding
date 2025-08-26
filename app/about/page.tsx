import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Award, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              About Marina By-The-Sea
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For the past 8 years, Marina By-The-Sea has been operated as a locally owned premier marina for local boat owners.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                We have 14 slips that are rented month-month. Located three blocks from the beach in central Lauderdale-By-The-Sea we are the premier location for your boat if you live in Lauderdale-By-The-Sea’s surrounding neighborhoods. 
                We are a customer focused marina, but we are not considered a full service marina. Contact us today to get on the waitlist.
                </p>
                <p>
                  Recently, we've rennovated our marina to become the most state of the art marina in the area, featuring 14 premium floating dock
                  slips and state-of-the-art surveillance.
                </p>
                <p>
                  Our commitment to ease and convenience has earned us the respect of our customers, and more importantly, the trust
                  and loyalty of our marina family. We're not just a place to dock your boat – we're your gateway to
                  unforgettable experiences on the water.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/marina-logo.svg"
                alt="Marina By-The-Sea founder"
                className="rounded-lg shadow-xl w-full"
              />
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
              These core principles guide everything we do at Marina By-The-Sea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Familiarity</h3>
                <p className="text-muted-foreground">
                  We strive for a relationship in every service we provide, from dock maintenance to customer care.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We foster a welcoming community where boat owners can connect, share experiences, and create lasting
                  friendships. Many of our customers are from the surrounding neighborhoods, and we are a family owned marina.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">Reliability</h3>
                <p className="text-muted-foreground">
                  Our small team is here to help you with your boat whether it is fueling, detailing, or small maintenance repairs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Contact CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-6">Ready to Join Our Marina Family?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Experience the Marina By-The-Sea difference. Contact us today to schedule a tour or learn more about our
            services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href="/slips">View Available Slips</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarinaFooter />
    </div>
  )
}
