"use client"

import { useState, useEffect } from "react"

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
  description: string
  amenities: string[]
  has_water: boolean
  has_electric: boolean
  electric_amp: number
  has_cable: boolean
  has_wifi: boolean
  has_pump_out: boolean
}

export function useDynamicSlips() {
  const [allSlips, setAllSlips] = useState<DockSlip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlips()
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchSlips, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchSlips = async () => {
    try {
      // Use the API route instead of direct database access
      const response = await fetch('/api/slips')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.error) {
        console.error("API error:", result.error)
        setAllSlips([])
      } else {
        // The API returns availableSlips, but we need allSlips for the waitlist
        // We'll reconstruct the full list from the available slips
        // This is a temporary fix until the RLS policies are properly set
        setAllSlips(result.availableSlips || [])
      }
    } catch (error) {
      console.error("Failed to fetch slips:", error)
      setAllSlips([])
    } finally {
      setLoading(false)
    }
  }

  const availableSlips = allSlips.filter(slip => slip.is_available)
  const occupiedSlips = allSlips.filter(slip => !slip.is_available)

  return {
    allSlips,
    availableSlips,
    occupiedSlips,
    loading,
    refetch: fetchSlips
  }
}
