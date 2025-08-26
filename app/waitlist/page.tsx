"use client"

import { Suspense } from "react"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Star } from "lucide-react"
import { WaitlistFormWrapper } from "@/components/waitlist-form-wrapper"
import { useDynamicSlips } from "@/components/dynamic-waitlist-section"

export default function WaitlistPage() {
  const { availableSlips, allSlips, loading } = useDynamicSlips()

  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              Join Our Waitlist
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Be the first to know when premium dock slips become available at Marina By-The-Sea. Join our exclusive
              waitlist today.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Waitlist Benefits */}
            <div>
              <h2 className="font-serif font-bold text-3xl text-foreground mb-8">Why Join Our Waitlist?</h2>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Priority Access</h3>
                        <p className="text-muted-foreground">
                          Get first priority when your preferred slip type becomes available. No more waiting or missing
                          out on the perfect spot.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Exclusive Updates</h3>
                        <p className="text-muted-foreground">
                          Receive personalized notifications about slip availability, marina events, and special offers
                          for waitlist members.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">VIP Treatment</h3>
                        <p className="text-muted-foreground">
                          Enjoy complimentary marina tours, priority customer service, and special pricing
                          considerations when your slip becomes available.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-6 bg-secondary/10 rounded-lg border border-secondary/20">
                <h3 className="font-semibold text-lg mb-2 text-secondary">Current Availability</h3>
                <p className="text-muted-foreground text-sm">
                  {availableSlips.length > 0 
                    ? `We currently have ${availableSlips.length} slip${availableSlips.length === 1 ? '' : 's'} available. Select the slips you're interested in below.`
                    : "We currently have a waiting list for all slips. Join our waitlist to be notified when slips become available."
                  }
                </p>
              </div>
            </div>

            {/* Waitlist Form */}
            <div>
              <Card>
                                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Join the Waitlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="text-center py-8">Loading waitlist form...</div>}>
                      <WaitlistFormWrapper allSlips={allSlips} />
                    </Suspense>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <MarinaFooter />
    </div>
  )
}
