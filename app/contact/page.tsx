"use client"

import type React from "react"
import { useState } from "react"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { createPublicClient } from "@/lib/supabase/public"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createPublicClient()

      const insertData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
      }

      const { error } = await supabase.from("contact_submissions").insert([insertData])

      if (error) {
        throw new Error(`Failed to submit contact form: ${error.message}`)
      }

      try {
        await fetch("/api/send-contact-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(insertData),
        })
      } catch {
        // Don't fail the form submission if emails fail
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
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

  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              Ask which path fits
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tell us what the money is for. We will point you at a guide on this site, or at a related site that does
              that job. A reply is a referral, not a rate quote or an approval.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif font-bold text-3xl text-foreground mb-8">Before you write</h2>

              <div className="space-y-6">
                <Card className="glass-card">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-lg">Read the matching guide</h3>
                    <p className="text-muted-foreground">
                      Most questions are already answered, without a rate, in the{" "}
                      <Link href="/guides" className="text-primary font-medium hover:underline">
                        funding guides
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-lg">Property and home loans</h3>
                    <p className="text-muted-foreground">
                      If you already know you need a mortgage, a commercial property loan, a bridge loan, a DSCR loan,
                      or a fix-and-flip loan, skip this form.{" "}
                      <a
                        href="https://unbeatableloans.com"
                        target="_blank"
                        rel="noopener"
                        className="text-primary font-medium hover:underline"
                      >
                        Unbeatable Loans
                      </a>{" "}
                      publishes those rates and arranges those loans with other lenders. NMLS #1827883 is John Pastre’s.
                      Unbeatable Loans is a related site.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold text-lg">What to include</h3>
                    <p className="text-muted-foreground">
                      Say what the funds would pay for, roughly how much, and how the business gets paid. Do not send a
                      Social Security number or a full account number in this form.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you. If there is a guide or a related site that fits what you described, that is the
                        reply you should expect. This message is not an application and it does not reserve a rate.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
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
                          <Label htmlFor="phone">Phone</Label>
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
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Working capital, equipment, property..."
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your business and funding needs..."
                          rows={5}
                        />
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}

                      <Button type="submit" className="w-full glass-button" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}
