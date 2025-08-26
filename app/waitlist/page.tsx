"use client"

import type React from "react"

import { useState } from "react"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Clock, Users, Star } from "lucide-react"

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    boat_length: "",
    preferred_slip_type: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("waitlist").insert([
        {
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone || null,
          boat_length: formData.boat_length ? Number.parseInt(formData.boat_length) : null,
          preferred_slip_type: formData.preferred_slip_type || null,
          message: formData.message || null,
        },
      ])

      if (error) throw error

      try {
        await fetch("/api/send-waitlist-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        console.log("[v0] Waitlist notification sent to admin")
      } catch (emailError) {
        console.error("[v0] Failed to send email notification:", emailError)
        // Don't fail the whole process if email fails
      }

      setIsSubmitted(true)
      setFormData({
        email: "",
        full_name: "",
        phone: "",
        boat_length: "",
        preferred_slip_type: "",
        message: "",
      })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_slip_type: value,
    }))
  }

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
                  We currently have a waiting list for premium and covered slips. Open slips typically have shorter wait
                  times. Average wait time is 3-6 months depending on your preferences.
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
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">You're on the List!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for joining our waitlist. We'll contact you as soon as a matching slip becomes
                        available. Our team has been notified of your request.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Add Another Person
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name *</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="boat_length">Boat Length (ft)</Label>
                          <Input
                            id="boat_length"
                            name="boat_length"
                            type="number"
                            value={formData.boat_length}
                            onChange={handleChange}
                            placeholder="e.g. 25"
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="preferred_slip_type">Preferred Slip Type</Label>
                        <Select onValueChange={handleSelectChange} value={formData.preferred_slip_type}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uncovered">Open Slip ($225-$350/mo)</SelectItem>
                            <SelectItem value="covered">Covered Slip ($450-$650/mo)</SelectItem>
                            <SelectItem value="premium">Premium Slip ($850-$950/mo)</SelectItem>
                            <SelectItem value="any">Any Available Slip</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Additional Information</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your boat, special requirements, or preferred timeline..."
                          rows={4}
                        />
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By joining our waitlist, you agree to receive notifications about slip availability and marina
                        updates. You can unsubscribe at any time.
                      </p>
                    </form>
                  )}
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
