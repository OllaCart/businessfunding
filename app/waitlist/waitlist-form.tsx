"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createPublicClient } from "@/lib/supabase/public"
import { CheckCircle, Anchor } from "lucide-react"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
  amenities: string[]
}

interface WaitlistFormProps {
  allSlips: DockSlip[]
  preSelectedSlips?: string[]
}

export function WaitlistForm({ allSlips, preSelectedSlips = [] }: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    boat_length: "",
    selected_slips: [] as string[],
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-select slips based on props
  useEffect(() => {
    if (preSelectedSlips.length > 0) {
      setFormData(prev => ({
        ...prev,
        selected_slips: preSelectedSlips
      }))
    }
  }, [preSelectedSlips])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createPublicClient()

    try {
      // Check if email already exists
      const { data: existingEntries, error: checkError } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", formData.email)

      if (checkError) {
        console.error("[v0] Error checking for duplicate email:", checkError)
      } else if (existingEntries && existingEntries.length > 0) {
        // Show duplicate message
        setIsSubmitted(true)
        setError("duplicate")
        return
      }

      // Insert new waitlist entry directly to Supabase using the same client that works in admin
      const { error } = await supabase.from("waitlist").insert([
        {
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone || null,
          boat_length: formData.boat_length ? Number.parseInt(formData.boat_length) : null,
          selected_slips: formData.selected_slips.length > 0 ? formData.selected_slips : [],
          message: formData.message || null,
          status: 'pending',
        },
      ])

      if (error) throw error

      // Send email notifications through API route
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
        console.error("[v0] Failed to send waitlist notification:", emailError)
        // Don't fail the form submission if email fails
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("[v0] Error submitting waitlist:", error)
      setError("Failed to submit waitlist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSlipSelection = (slipId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selected_slips: [...prev.selected_slips, slipId]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        selected_slips: prev.selected_slips.filter(id => id !== slipId)
      }))
    }
  }

  // Sort slips: available first, then by length (high to low)
  const sortedAvailableSlips = allSlips
    .filter(slip => slip.is_available)
    .sort((a, b) => b.length_capacity - a.length_capacity)

  const sortedOccupiedSlips = allSlips
    .filter(slip => !slip.is_available)
    .sort((a, b) => b.length_capacity - a.length_capacity)

  if (isSubmitted && error === "duplicate") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Already on the Waitlist!</h3>
          <p className="text-muted-foreground mb-4">
            You're already registered with this email address. We'll notify you when slips become available.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Entry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Successfully Added to Waitlist!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for joining our waitlist. We'll notify you when slips become available.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Add Another Entry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Join the Waitlist</CardTitle>
        <p className="text-center text-muted-foreground">
          Fill out the form below to join our exclusive waitlist for premium dock slips.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="boat_length">Boat Length (ft) *</Label>
              <Input
                id="boat_length"
                type="number"
                value={formData.boat_length}
                onChange={(e) => setFormData({ ...formData, boat_length: e.target.value })}
                required
                placeholder="Enter boat length in feet"
              />
            </div>
          </div>

          {/* Available Slips Selection */}
          {sortedAvailableSlips.length > 0 && (
            <div>
              <Label className="text-base font-medium">Available Slips</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select the slips you're interested in. You'll be notified when they become available.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedAvailableSlips.map((slip) => (
                  <div key={slip.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`slip-${slip.id}`}
                      checked={formData.selected_slips.includes(slip.id)}
                      onCheckedChange={(checked) => 
                        handleSlipSelection(slip.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`slip-${slip.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Slip {slip.slip_number}</span>
                        <Badge variant="default" className="text-xs">
                          {slip.length_capacity}' × {slip.beam_capacity}'
                        </Badge>
                      </div>
                      {slip.show_price && (
                        <div className="text-xs text-muted-foreground">
                          ${slip.monthly_rate}/mo
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Occupied Slips Information */}
          {sortedOccupiedSlips.length > 0 && (
            <div>
              <Label className="text-base font-medium">Currently Occupied Slips</Label>
              <p className="text-sm text-muted-foreground mb-3">
                These slips are currently occupied but you can still join the waitlist for when they become available.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedOccupiedSlips.map((slip) => (
                  <div key={slip.id} className="flex items-center space-x-2 opacity-60">
                    <Checkbox
                      id={`slip-${slip.id}`}
                      checked={formData.selected_slips.includes(slip.id)}
                      onCheckedChange={(checked) => 
                        handleSlipSelection(slip.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`slip-${slip.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Slip {slip.slip_number}</span>
                        <Badge variant="secondary" className="text-xs">
                          {slip.length_capacity}' × {slip.beam_capacity}'
                        </Badge>
                      </div>
                      {slip.show_price && (
                        <div className="text-xs text-muted-foreground">
                          ${slip.monthly_rate}/mo
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your boating needs, preferred timing, or any special requirements..."
              rows={4}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding to Waitlist..." : "Join Waitlist"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By joining the waitlist, you agree to receive notifications about slip availability and marina updates.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
