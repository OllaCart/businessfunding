'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

interface SlipOfferModalProps {
  isOpen: boolean
  onClose: () => void
  entry: {
    id: string
    full_name: string
    email: string
  } | null
  slip: {
    id: string
    slip_number: string
    length_capacity: number
  } | null
}

export function SlipOfferModal({ isOpen, onClose, entry, slip }: SlipOfferModalProps) {
  const [pricePerFoot, setPricePerFoot] = useState(40)
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total monthly cost when price per foot changes
  useEffect(() => {
    if (slip) {
      const totalCost = slip.length_capacity * pricePerFoot
      setTotalMonthlyCost(totalCost)
    }
  }, [pricePerFoot, slip])

  const handleSubmit = async () => {
    if (!entry || !slip) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      
      // Create slip offer record
      const { data, error } = await supabase.rpc('create_slip_offer', {
        waitlistEntryId: entry.id,
        slipId: slip.id,
        offeredPricePerFoot: pricePerFoot,
        totalMonthlyCost: totalMonthlyCost,
        offerExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        termsAndConditions: 'Please contact us for details.'
      })

      if (error) {
        console.error('Error creating slip offer:', error)
        throw error
      }

      console.log('Slip offer created successfully:', data)
      
      // Update waitlist entry status to 'offered'
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ status: 'offered' })
        .eq('id', entry.id)

      if (updateError) {
        console.error('Error updating waitlist status:', updateError)
      }

      // Send email notification
      try {
        const response = await fetch('/api/slip-offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            waitlistEntryId: entry.id,
            slipId: slip.id,
            pricePerFoot,
            totalMonthlyCost,
            recipientEmail: entry.email,
            recipientName: entry.full_name,
            slipNumber: slip.slip_number
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        console.log('Email notification sent successfully')
        alert(`Slip offer sent successfully to ${entry.full_name}!`)
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
        alert('Slip offer created but email failed to send')
      }

      // Close modal and reset form
      onClose()
      setPricePerFoot(40)
      setTotalMonthlyCost(0)

    } catch (error) {
      console.error('Error in createSlipOffer:', error)
      alert('Failed to create slip offer')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!entry || !slip) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Slip Offer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price-per-foot">Price Per Foot ($)</Label>
              <Input
                id="price-per-foot"
                type="number"
                step="0.01"
                value={pricePerFoot}
                onChange={(e) => setPricePerFoot(parseFloat(e.target.value) || 0)}
                placeholder="40.00"
              />
            </div>
            <div>
              <Label htmlFor="total-monthly-cost">Total Monthly Cost ($)</Label>
              <Input
                id="total-monthly-cost"
                type="number"
                step="0.01"
                value={totalMonthlyCost}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                {slip.length_capacity} ft × ${pricePerFoot}/ft = ${totalMonthlyCost}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Offer Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Slip:</strong> {slip.slip_number}</p>
              <p><strong>Length:</strong> {slip.length_capacity} feet</p>
              <p><strong>Price per foot:</strong> ${pricePerFoot}</p>
              <p><strong>Monthly cost:</strong> ${totalMonthlyCost}</p>
              <p><strong>Recipient:</strong> {entry.full_name} ({entry.email})</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Offer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
