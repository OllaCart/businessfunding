"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Anchor } from "lucide-react"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  amenities: string[]
}

interface WaitlistFormProps {
  allSlips: DockSlip[]
}

export function WaitlistForm({ allSlips }: WaitlistFormProps) {
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
          preferred_slip_type: formData.selected_slips.length > 0 ? formData.selected_slips.join(', ') : null,
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
        selected_slips: [],
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

  const handleSlipSelection = (slipId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selected_slips: checked
        ? [...prev.selected_slips, slipId]
        : prev.selected_slips.filter((id) => id !== slipId),
    }))
  }

  if (isSubmitted) {
    return (
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
    )
  }

  return (
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

      {allSlips.length > 0 && (
        <div>
          <Label>Slips You're Interested In</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select all slips you'd be interested in, including currently occupied ones. You can choose multiple options.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allSlips.map((slip) => (
              <div key={slip.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`slip-${slip.id}`}
                  checked={formData.selected_slips.includes(slip.id)}
                  onCheckedChange={(checked) => handleSlipSelection(slip.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={`slip-${slip.id}`} className="text-sm font-medium cursor-pointer">
                    Slip {slip.slip_number}
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    {slip.length_capacity}' × {slip.beam_capacity}' • ${slip.monthly_rate.toLocaleString()}/month
                  </div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-1 rounded ${
                      slip.is_available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {slip.is_available ? 'Available' : 'Currently Occupied'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
  )
}
