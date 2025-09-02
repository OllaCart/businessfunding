"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EndOccupancyModalProps {
  isOpen: boolean
  onClose: () => void
  occupant: {
    id: string
    full_name: string
    email: string
    boat_name: string
    slip_number: string
  }
  onOccupancyEnded: () => void
}

export default function EndOccupancyModal({ 
  isOpen, 
  onClose, 
  occupant, 
  onOccupancyEnded 
}: EndOccupancyModalProps) {
  const [departureDate, setDepartureDate] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set default departure date to 30 days from now
  useEffect(() => {
    if (isOpen) {
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 30)
      setDepartureDate(defaultDate.toISOString().split('T')[0])
      setMessage("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departureDate) {
      toast({
        title: "Error",
        description: "Please select a departure date",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Send email notification
      const response = await fetch('/api/send-end-occupancy-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occupant: {
            full_name: occupant.full_name,
            email: occupant.email,
            boat_name: occupant.boat_name,
            slip_number: occupant.slip_number,
          },
          departureDate,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      // End the occupancy (archive occupant, update slip)
      const endResponse = await fetch('/api/end-occupancy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occupantId: occupant.id,
          slipNumber: occupant.slip_number,
        }),
      })

      if (!endResponse.ok) {
        throw new Error('Failed to end occupancy')
      }

      toast({
        title: "Success",
        description: `Occupancy ended for ${occupant.full_name}. Email sent successfully.`,
      })

      onOccupancyEnded()
      onClose()
    } catch (error) {
      console.error('Error ending occupancy:', error)
      toast({
        title: "Error",
        description: "Failed to end occupancy. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            End Occupancy - {occupant.full_name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Occupant:</strong> {occupant.full_name}<br/>
              <strong>Boat:</strong> {occupant.boat_name}<br/>
              <strong>Slip:</strong> {occupant.slip_number}
            </p>
          </div>

          <div>
            <Label htmlFor="departureDate">Departure Date *</Label>
            <Input
              id="departureDate"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Personal Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to thank the occupant..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send & End Occupancy
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
