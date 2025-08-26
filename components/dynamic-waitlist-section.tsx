"use client"

import { useState, useEffect } from "react"
import { createPublicClient } from "@/lib/supabase/public"

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
      const supabase = createPublicClient()
      const { data: slips, error } = await supabase.from("dock_slips").select("*").order("slip_number")
      
      if (error) {
        console.error("Error fetching slips:", error)
      } else if (slips) {
        setAllSlips(slips)
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
