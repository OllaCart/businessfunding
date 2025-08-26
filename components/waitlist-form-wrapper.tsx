"use client"

import { useSearchParams } from "next/navigation"
import { WaitlistForm } from "@/app/waitlist/waitlist-form"

interface WaitlistFormWrapperProps {
  allSlips: any[]
}

export function WaitlistFormWrapper({ allSlips }: WaitlistFormWrapperProps) {
  const searchParams = useSearchParams()
  
  // Get pre-selected slips from URL parameters
  const selectedSlipIds = searchParams.get('slips')
  const preSelectedSlips = selectedSlipIds ? selectedSlipIds.split(',').map(id => id.trim()) : []
  
  return <WaitlistForm allSlips={allSlips} preSelectedSlips={preSelectedSlips} />
}
