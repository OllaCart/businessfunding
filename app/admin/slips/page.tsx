"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Anchor, DollarSign, Users, Wifi, Zap, Droplets, Shield, UserPlus, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import EndOccupancyModal from "@/components/end-occupancy-modal"

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
  created_at: string
  updated_at: string
  current_occupant_id?: string
}

interface CurrentOccupant {
  id: string
  slip_id: string
  full_name: string
  email: string
  phone: string
  boat_name: string
  boat_length: number
  boat_beam: number
  contract_start_date: string
  contract_end_date?: string
  monthly_rate: number
  notes?: string
  created_at: string
  updated_at: string
}

const amenityOptions = [
  { value: "power", label: "Power", icon: Zap },
  { value: "water", label: "Water", icon: Droplets },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "security", label: "Security", icon: Shield },
  { value: "valet", label: "Valet", icon: Users },
  { value: "fuel", label: "Fuel", icon: DollarSign },
  { value: "pump-out", label: "Pump-out", icon: Anchor },
  { value: "concierge", label: "Concierge", icon: Users },
]

export default function AdminSlipsPage() {
  const [slips, setSlips] = useState<DockSlip[]>([])
  const [occupants, setOccupants] = useState<CurrentOccupant[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlip, setEditingSlip] = useState<DockSlip | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isOccupantDialogOpen, setIsOccupantDialogOpen] = useState(false)
  const [selectedSlip, setSelectedSlip] = useState<DockSlip | null>(null)
  const [endOccupancyModal, setEndOccupancyModal] = useState<{
    isOpen: boolean
    occupant: CurrentOccupant | null
  }>({ isOpen: false, occupant: null })
  const [formData, setFormData] = useState({
    slip_number: "",
    length_capacity: "",
    beam_capacity: "",
    monthly_rate: "",
    is_available: true,
    show_price: true,
    description: "",
    amenities: [] as string[],
  })
  const [occupantForm, setOccupantForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    boat_name: "",
    boat_length: "",
    boat_beam: "",
    monthly_rate: "",
    notes: "",
  })
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchSlips()
    fetchOccupants()
  }, [])

  const fetchSlips = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("dock_slips").select("*").order("slip_number", { ascending: true })
      
      if (error) {
        console.error("Error fetching slips:", error)
      } else if (data) {
        // Sort numerically by slip number to ensure proper order (1, 2, 3... 14)
        const sortedSlips = data.sort((a, b) => {
          const aNum = parseInt(a.slip_number)
          const bNum = parseInt(b.slip_number)
          return aNum - bNum
        })
        setSlips(sortedSlips)
      }
    } catch (error) {
      console.error("Error fetching slips:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOccupants = async () => {
    try {
      const { data, error } = await supabase.from("current_occupants").select("*")
      if (error) throw error
      setOccupants(data || [])
    } catch (error) {
      console.error("Error fetching occupants:", error)
    }
  }

  const getOccupantForSlip = (slipId: string) => {
    return occupants.find(occupant => occupant.slip_id === slipId)
  }

  const handleAvailabilityToggle = async (slipId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from("dock_slips")
        .update({ is_available: !currentAvailability })
        .eq("id", slipId)

      if (error) throw error

      setSlips((prev) =>
        prev.map((slip) => (slip.id === slipId ? { ...slip, is_available: !currentAvailability } : slip)),
      )

      toast({
        title: "Success",
        description: `Slip availability updated`,
      })
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update slip availability",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (slip: DockSlip) => {
    setEditingSlip(slip)
    setFormData({
      slip_number: slip.slip_number,
      length_capacity: slip.length_capacity.toString(),
      beam_capacity: slip.beam_capacity.toString(),
      monthly_rate: slip.monthly_rate.toString(),
      is_available: slip.is_available,
      show_price: slip.show_price ?? true,
      description: slip.description,
      amenities: slip.amenities,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingSlip(null)
    setFormData({
      slip_number: "",
      length_capacity: "",
      beam_capacity: "",
      monthly_rate: "",
      is_available: true,
      show_price: true,
      description: "",
      amenities: [],
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate required fields
      if (!formData.length_capacity || !formData.beam_capacity || !formData.monthly_rate) {
        throw new Error("Length, beam, and monthly rate are required")
      }

      const slipData = {
        slip_number: formData.slip_number,
        length_capacity: Number.parseInt(formData.length_capacity),
        beam_capacity: Number.parseInt(formData.beam_capacity),
        monthly_rate: Number.parseFloat(formData.monthly_rate),
        is_available: formData.is_available,
        show_price: formData.show_price,
        description: formData.description || "",
        amenities: formData.amenities || [],
      }

      if (editingSlip) {
        const { error } = await supabase.from("dock_slips").update(slipData).eq("id", editingSlip.id)
        if (error) throw error
        toast({ title: "Success", description: "Slip updated successfully" })
      } else {
        const { error } = await supabase.from("dock_slips").insert([slipData])
        if (error) throw error
        toast({ title: "Success", description: "Slip created successfully" })
      }

      setIsDialogOpen(false)
      fetchSlips()
    } catch (error) {
      console.error("Error saving slip:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save slip. Please check the database schema.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (slipId: string) => {
    if (!confirm("Are you sure you want to delete this slip?")) return

    try {
      const { error } = await supabase.from("dock_slips").delete().eq("id", slipId)
      if (error) throw error

      setSlips((prev) => prev.filter((slip) => slip.id !== slipId))
      toast({ title: "Success", description: "Slip deleted successfully" })
    } catch (error) {
      console.error("Error deleting slip:", error)
      toast({
        title: "Error",
        description: "Failed to delete slip",
        variant: "destructive",
      })
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleAddOccupant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlip) return

    try {
      // Create the occupant
      const { data: newOccupant, error: occupantError } = await supabase
        .from("current_occupants")
        .insert({
          slip_id: selectedSlip.id,
          full_name: occupantForm.full_name,
          email: occupantForm.email,
          phone: occupantForm.phone,
          boat_name: occupantForm.boat_name,
          boat_length: parseInt(occupantForm.boat_length),
          boat_beam: parseInt(occupantForm.boat_beam),
          monthly_rate: parseFloat(occupantForm.monthly_rate),
          notes: occupantForm.notes,
          contract_start_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

      if (occupantError) throw occupantError

      // Update the slip to mark it as occupied
      const { error: slipError } = await supabase
        .from("dock_slips")
        .update({ 
          is_available: false,
          current_occupant_id: newOccupant.id
        })
        .eq("id", selectedSlip.id)

      if (slipError) throw slipError

      // Refresh data
      await fetchSlips()
      await fetchOccupants()

      // Reset form and close dialog
      setOccupantForm({
        full_name: "",
        email: "",
        phone: "",
        boat_name: "",
        boat_length: "",
        boat_beam: "",
        monthly_rate: "",
        notes: "",
      })
      setIsOccupantDialogOpen(false)
      setSelectedSlip(null)

      toast({
        title: "Success",
        description: `Occupant added to Slip ${selectedSlip.slip_number}`,
      })
    } catch (error) {
      console.error("Error adding occupant:", error)
      toast({
        title: "Error",
        description: "Failed to add occupant",
        variant: "destructive",
      })
    }
  }

  const handleOccupancyEnded = async () => {
    // Refresh data after occupancy is ended
    await fetchSlips()
    await fetchOccupants()
  }



  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">Dock Slips Management</h1>
          <p className="text-muted-foreground">Manage slip availability, pricing, and details</p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Slip
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{slips.length}</div>
            <div className="text-sm text-muted-foreground">Total Slips</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{slips.filter((s) => s.is_available).length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{slips.filter((s) => !s.is_available).length}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {slips.length > 0
                ? Math.round(((slips.length - slips.filter((s) => s.is_available).length) / slips.length) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-muted-foreground">Occupancy</div>
          </CardContent>
        </Card>
      </div>

      {/* Slips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slips.map((slip) => {
          const occupant = getOccupantForSlip(slip.id)
          return (
            <Card key={slip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Slip {slip.slip_number}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={slip.is_available ? "default" : "secondary"}>
                      {slip.is_available ? "Available" : "Occupied"}
                    </Badge>
                    <Switch
                      checked={slip.is_available}
                      onCheckedChange={() => handleAvailabilityToggle(slip.id, slip.is_available)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{slip.length_capacity}' L × {slip.beam_capacity}' W</span>
                  {slip.show_price ? (
                    <span className="font-semibold">${slip.monthly_rate}/mo</span>
                  ) : (
                    <span className="text-muted-foreground">Price upon request</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Occupant Information */}
                {occupant && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Occupant</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Name:</strong> {occupant.full_name}</div>
                      <div><strong>Boat:</strong> {occupant.boat_name}</div>
                      <div><strong>Contact:</strong> {occupant.email}</div>
                      <div><strong>Rate:</strong> ${occupant.monthly_rate}/mo</div>
                      <div><strong>Since:</strong> {new Date(occupant.contract_start_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={slip.is_available ? "default" : "secondary"}>
                    {slip.is_available ? "Available" : "Occupied"}
                  </Badge>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-2">Amenities</span>
                  <div className="flex flex-wrap gap-1">
                    {slip.amenities.map((amenity) => {
                      const amenityOption = amenityOptions.find((opt) => opt.value === amenity)
                      const IconComponent = amenityOption?.icon || Anchor
                      return (
                        <div key={amenity} className="flex items-center space-x-1 bg-muted px-2 py-1 rounded text-xs">
                          <IconComponent className="h-3 w-3" />
                          <span>{amenityOption?.label || amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  {slip.is_available ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedSlip(slip)
                        setIsOccupantDialogOpen(true)
                      }}
                      className="flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Occupant
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const occupant = getOccupantForSlip(slip.id)
                        if (occupant) {
                          setEndOccupancyModal({
                            isOpen: true,
                            occupant: {
                              ...occupant,
                              slip_number: slip.slip_number
                            }
                          })
                        }
                      }}
                      className="flex-1 text-orange-600"
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      End Occupancy
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(slip)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(slip.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlip ? "Edit Slip" : "Add New Slip"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slip_number">Slip Number *</Label>
                <Input
                  id="slip_number"
                  value={formData.slip_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slip_number: e.target.value }))}
                  placeholder="e.g. A-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="length_capacity">Length Capacity (ft) *</Label>
                <Input
                  id="length_capacity"
                  type="number"
                  value={formData.length_capacity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, length_capacity: e.target.value }))}
                  placeholder="e.g. 25"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beam_capacity">Beam Capacity (ft) *</Label>
                <Input
                  id="beam_capacity"
                  type="number"
                  value={formData.beam_capacity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, beam_capacity: e.target.value }))}
                  placeholder="e.g. 10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthly_rate">Monthly Rate ($) *</Label>
                <Input
                  id="monthly_rate"
                  type="number"
                  step="0.01"
                  value={formData.monthly_rate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monthly_rate: e.target.value }))}
                  placeholder="e.g. 450.00"
                  required
                />
              </div>
            </div>



            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the slip..."
                rows={3}
              />
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {amenityOptions.map((amenity) => {
                  const IconComponent = amenity.icon
                  return (
                    <div
                      key={amenity.value}
                      className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-colors ${
                        formData.amenities.includes(amenity.value)
                          ? "bg-primary/10 border-primary"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                      onClick={() => handleAmenityToggle(amenity.value)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_available: checked }))}
              />
              <Label htmlFor="is_available">Available for rent</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show_price"
                checked={formData.show_price}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, show_price: checked }))}
              />
              <Label htmlFor="show_price">Show price publicly</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingSlip ? "Update Slip" : "Create Slip"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Occupant Dialog */}
      <Dialog open={isOccupantDialogOpen} onOpenChange={setIsOccupantDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Occupant to Slip {selectedSlip?.slip_number}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOccupant} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={occupantForm.full_name}
                  onChange={(e) => setOccupantForm({ ...occupantForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={occupantForm.email}
                  onChange={(e) => setOccupantForm({ ...occupantForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={occupantForm.phone}
                  onChange={(e) => setOccupantForm({ ...occupantForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="boat_name">Boat Name</Label>
                <Input
                  id="boat_name"
                  value={occupantForm.boat_name}
                  onChange={(e) => setOccupantForm({ ...occupantForm, boat_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="boat_length">Boat Length (ft)</Label>
                <Input
                  id="boat_length"
                  type="number"
                  value={occupantForm.boat_length}
                  onChange={(e) => setOccupantForm({ ...occupantForm, boat_length: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="boat_beam">Boat Beam (ft)</Label>
                <Input
                  id="boat_beam"
                  type="number"
                  value={occupantForm.boat_beam}
                  onChange={(e) => setOccupantForm({ ...occupantForm, boat_beam: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="monthly_rate">Monthly Rate ($) *</Label>
              <Input
                id="monthly_rate"
                type="number"
                step="0.01"
                value={occupantForm.monthly_rate}
                onChange={(e) => setOccupantForm({ ...occupantForm, monthly_rate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={occupantForm.notes}
                onChange={(e) => setOccupantForm({ ...occupantForm, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOccupantDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Occupant
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* End Occupancy Modal */}
      {endOccupancyModal.occupant && (
        <EndOccupancyModal
          isOpen={endOccupancyModal.isOpen}
          onClose={() => setEndOccupancyModal({ isOpen: false, occupant: null })}
          occupant={endOccupancyModal.occupant}
          onOccupancyEnded={handleOccupancyEnded}
        />
      )}
    </div>
  )
}
