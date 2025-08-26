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
import { Plus, Edit, Trash2, Anchor, DollarSign, Users, Wifi, Zap, Droplets, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const [loading, setLoading] = useState(true)
  const [editingSlip, setEditingSlip] = useState<DockSlip | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchSlips()
  }, [])

  const fetchSlips = async () => {
    try {
      const { data, error } = await supabase.from("dock_slips").select("*").order("slip_number")

      if (error) throw error
      setSlips(data || [])
    } catch (error) {
      console.error("Error fetching slips:", error)
      toast({
        title: "Error",
        description: "Failed to fetch dock slips",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      const slipData = {
        slip_number: formData.slip_number,
        length_capacity: Number.parseInt(formData.length_capacity),
        beam_capacity: Number.parseInt(formData.beam_capacity),
        monthly_rate: Number.parseFloat(formData.monthly_rate),
        is_available: formData.is_available,
        show_price: formData.show_price,
        description: formData.description,
        amenities: formData.amenities,
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
        description: "Failed to save slip",
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
        {slips.map((slip) => (
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
                <Button variant="outline" size="sm" onClick={() => handleEdit(slip)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(slip.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
    </div>
  )
}
