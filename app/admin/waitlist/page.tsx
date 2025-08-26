"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

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
  contract_end_date: string
  monthly_rate: number
  notes: string
}

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
  amenities: string[]
  current_occupant_id?: string
}

interface WaitlistEntry {
  id: string
  full_name: string
  email: string
  phone: string
  boat_length: number
  selected_slips: string[]
  message: string
  status: 'pending' | 'contacted' | 'converted'
  created_at: string
  priority_order?: number
}

function PipelineView({ slips, waitlistEntries, currentOccupants, onUpdateOccupant, onDuplicateEntry }: { 
  slips: DockSlip[], 
  waitlistEntries: WaitlistEntry[],
  currentOccupants: CurrentOccupant[],
  onUpdateOccupant: (occupant: CurrentOccupant) => void,
  onDuplicateEntry: (entry: WaitlistEntry, targetSlipId: string) => void
}) {
  const [draggedEntry, setDraggedEntry] = useState<WaitlistEntry | null>(null)
  const [emailDialog, setEmailDialog] = useState<{
    isOpen: boolean
    entry: WaitlistEntry | null
    action: 'notify' | 'call' | null
  }>({
    isOpen: false,
    entry: null,
    action: null
  })

  const [occupantEditDialog, setOccupantEditDialog] = useState<{
    isOpen: boolean
    occupant: CurrentOccupant | null
  }>({
    isOpen: false,
    occupant: null
  })

  const [duplicateDialog, setDuplicateDialog] = useState<{
    isOpen: boolean
    entry: WaitlistEntry | null
    targetSlipId: string | null
  }>({
    isOpen: false,
    entry: null,
    targetSlipId: null
  })

  const [emailContent, setEmailContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetSlipId: string | null) => {
    e.preventDefault()
    
    if (!draggedEntry) return

    if (targetSlipId === 'duplicate') {
      // Open duplicate dialog
      setDuplicateDialog({
        isOpen: true,
        entry: draggedEntry,
        targetSlipId: null
      })
    } else if (targetSlipId) {
      // Move entry to specific slip
      onDuplicateEntry(draggedEntry, targetSlipId)
    }
    
    setDraggedEntry(null)
  }

  const handleDragStart = (e: React.DragEvent, entry: WaitlistEntry) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(entry))
    setDraggedEntry(entry)
  }

  const onSendEmail = (entry: WaitlistEntry, action: 'notify' | 'call') => {
    let subject = ''
    let content = ''

    if (action === 'notify') {
      subject = `Status Update - Marina By-The-Sea`
      content = `Dear ${entry.full_name},

We wanted to update you on the status of your waitlist application.

[Your status update message here]

Best regards,
The Marina By-The-Sea Team`
    } else if (action === 'call') {
      subject = `Slip Available - Marina By-The-Sea`
      content = `Dear ${entry.full_name},

Great news! A slip matching your requirements has become available.

Please call us at (954) 790-1588 to discuss this opportunity and arrange a viewing.

Best regards,
The Marina By-The-Sea Team`
    }

    setEmailSubject(subject)
    setEmailContent(content)
    setEmailDialog({
      isOpen: true,
      entry,
      action
    })
  }

  const getEntriesForSlip = (slipId: string) => {
    return waitlistEntries
      .filter(entry => 
        entry.selected_slips && Array.isArray(entry.selected_slips) && entry.selected_slips.includes(slipId)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const getGeneralEntries = () => {
    return waitlistEntries
      .filter(entry => 
        !entry.selected_slips || !Array.isArray(entry.selected_slips) || entry.selected_slips.length === 0
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  const getOccupantForSlip = (slipId: string) => {
    return currentOccupants.find(occupant => occupant.slip_id === slipId)
  }

  const getEntryStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Waitlist Pipeline</h1>
        <div className="text-sm text-gray-600">
          {waitlistEntries.length} entries • {slips.length} slips
        </div>
      </div>

      {/* Pipeline Rows */}
      <div className="space-y-4">
        {/* General Interest Row */}
        <div 
          className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50 min-h-[200px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, null)}
        >
          <div className="text-center mb-4 text-blue-700">
            <h3 className="font-bold text-lg">General Interest</h3>
            <div className="text-sm">Any Available Slip</div>
            <div className="text-xs text-blue-600 mt-1">Drag entries here to remove from specific slips</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {getGeneralEntries().map((entry, index) => (
              <Card 
                key={entry.id} 
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, entry)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{entry.full_name}</div>
                    <Badge className="text-xs bg-blue-100 text-blue-800">#{index + 1}</Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{entry.email}</div>
                    {entry.phone && <div>{entry.phone}</div>}
                    <div>{entry.boat_length}' boat</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => onSendEmail(entry, 'notify')}
                    >
                      📧 Status Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => setDuplicateDialog({
                        isOpen: true,
                        entry,
                        targetSlipId: null
                      })}
                    >
                      📋 Duplicate to Slip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getGeneralEntries().length === 0 && (
              <div className="text-center text-gray-500 py-8 col-span-full">
                <div className="text-2xl mb-2">📭</div>
                <div className="text-sm">No general entries</div>
              </div>
            )}
          </div>
        </div>

        {/* Slip Rows */}
        {slips.map(slip => {
          const occupant = getOccupantForSlip(slip.id)
          return (
            <div 
              key={slip.id}
              className={`border-2 border-dashed rounded-lg p-4 min-h-[200px] ${
                slip.is_available 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slip.id)}
            >
              <div className={`text-center mb-4 ${
                slip.is_available ? 'text-green-700' : 'text-red-700'
              }`}>
                <h3 className="font-bold text-lg">Slip {slip.slip_number}</h3>
                <div className="text-sm">
                  <div>{slip.length_capacity}' × {slip.beam_capacity}'</div>
                  <div className="font-medium">
                    {slip.is_available ? 'Available' : 'Occupied'}
                  </div>
                  {slip.show_price && <div>${slip.monthly_rate}/month</div>}
                </div>
                
                {/* Show current occupant if slip is occupied */}
                {!slip.is_available && occupant && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <div className="text-xs font-medium text-red-700">Current Occupant</div>
                    <div className="text-xs">{occupant.full_name}</div>
                    <div className="text-xs">{occupant.boat_name}</div>
                    {occupant.contract_end_date && (
                      <div className="text-xs text-red-600">
                        Contract: {new Date(occupant.contract_end_date).toLocaleDateString()}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs mt-2"
                      onClick={() => setOccupantEditDialog({
                        isOpen: true,
                        occupant
                      })}
                    >
                      ✏️ Edit Occupant
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {getEntriesForSlip(slip.id).map((entry, index) => (
                  <Card 
                    key={entry.id} 
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, entry)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{entry.full_name}</div>
                        <Badge className={`text-xs ${getEntryStatusColor(entry.status)}`}>
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{entry.email}</div>
                        {entry.phone && <div>{entry.phone}</div>}
                        <div>{entry.boat_length}' boat</div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {slip.is_available && index === 0 && (
                          <Button
                            size="sm"
                            className="w-full text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => onSendEmail(entry, 'call')}
                          >
                            🚀 Email First in Line
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => onSendEmail(entry, 'notify')}
                        >
                          📧 Status Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => setDuplicateDialog({
                            isOpen: true,
                            entry,
                            targetSlipId: null
                          })}
                        >
                          📋 Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getEntriesForSlip(slip.id).length === 0 && (
                  <div className="text-center text-gray-500 py-8 col-span-full">
                    <div className="text-2xl mb-2">📭</div>
                    <div className="text-sm">No entries for this slip</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialog.isOpen} onOpenChange={(open) => 
        setEmailDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {emailDialog.action === 'notify' ? 'Send Status Update' : 'Notify of Availability'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To:</Label>
              <Input
                id="email-to"
                value={emailDialog.entry?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="email-subject">Subject:</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email-content">Message:</Label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={8}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEmailDialog({ isOpen: false, entry: null, action: null })}
              >
                Cancel
              </Button>
              <Button onClick={async () => {
                if (!emailDialog.entry) return
                
                try {
                  const response = await fetch('/api/send-admin-email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      to: emailDialog.entry.email,
                      subject: emailSubject,
                      content: emailContent,
                      entryId: emailDialog.entry.id,
                      slipId: null,
                      action: emailDialog.action
                    })
                  })

                  if (response.ok) {
                    alert('Email sent successfully!')
                    setEmailDialog({ isOpen: false, entry: null, action: null })
                  } else {
                    alert('Failed to send email')
                  }
                } catch (error) {
                  console.error('Error sending email:', error)
                  alert('Error sending email')
                }
              }}>
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Occupant Edit Dialog */}
      <Dialog open={occupantEditDialog.isOpen} onOpenChange={(open) => 
        setOccupantEditDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Current Occupant</DialogTitle>
          </DialogHeader>
          
          {occupantEditDialog.occupant && (
            <OccupantEditForm 
              occupant={occupantEditDialog.occupant}
              onSave={(updatedOccupant) => {
                onUpdateOccupant(updatedOccupant)
                setOccupantEditDialog({ isOpen: false, occupant: null })
              }}
              onCancel={() => setOccupantEditDialog({ isOpen: false, occupant: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Duplicate Entry Dialog */}
      <Dialog open={duplicateDialog.isOpen} onOpenChange={(open) => 
        setDuplicateDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Duplicate Entry to Slip</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="target-slip">Select Target Slip:</Label>
              <select 
                id="target-slip"
                className="w-full p-2 border rounded"
                onChange={(e) => setDuplicateDialog(prev => ({ ...prev, targetSlipId: e.target.value }))}
              >
                <option value="">Choose a slip...</option>
                {slips.map(slip => (
                  <option key={slip.id} value={slip.id}>
                    Slip {slip.slip_number} ({slip.length_capacity}' × {slip.beam_capacity}')
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDuplicateDialog({ isOpen: false, entry: null, targetSlipId: null })}
              >
                Cancel
              </Button>
              <Button 
                disabled={!duplicateDialog.targetSlipId}
                onClick={() => {
                  if (duplicateDialog.entry && duplicateDialog.targetSlipId) {
                    onDuplicateEntry(duplicateDialog.entry, duplicateDialog.targetSlipId)
                    setDuplicateDialog({ isOpen: false, entry: null, targetSlipId: null })
                  }
                }}
              >
                Duplicate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OccupantEditForm({ occupant, onSave, onCancel }: {
  occupant: CurrentOccupant
  onSave: (occupant: CurrentOccupant) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(occupant)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="boat-name">Boat Name</Label>
          <Input
            id="boat-name"
            value={formData.boat_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, boat_name: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="boat-length">Boat Length (ft)</Label>
          <Input
            id="boat-length"
            type="number"
            value={formData.boat_length || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, boat_length: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="boat-beam">Boat Beam (ft)</Label>
          <Input
            id="boat-beam"
            type="number"
            value={formData.boat_beam || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, boat_beam: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="monthly-rate">Monthly Rate</Label>
          <Input
            id="monthly-rate"
            type="number"
            step="0.01"
            value={formData.monthly_rate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, monthly_rate: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contract-start">Contract Start</Label>
          <Input
            id="contract-start"
            type="date"
            value={formData.contract_start_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, contract_start_date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="contract-end">Contract End</Label>
          <Input
            id="contract-end"
            type="date"
            value={formData.contract_end_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, contract_end_date: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
}

export default function AdminWaitlistPage() {
  const [slips, setSlips] = useState<DockSlip[]>([])
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [currentOccupants, setCurrentOccupants] = useState<CurrentOccupant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        let supabase
        try {
          supabase = createClient()
        } catch (clientError) {
          console.error('Failed to create Supabase client:', clientError)
          setError('Configuration error. Please check environment variables.')
          setLoading(false)
          return
        }
        
        // Check authentication first
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !currentUser) {
          setError('Authentication required. Please log in.')
          setLoading(false)
          return
        }

        // Check if user is admin
        const { data: adminProfile, error: adminError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (adminError || !adminProfile) {
          setError('Admin access required.')
          setLoading(false)
          return
        }

        setUser(currentUser)
        
        // Fetch slips
        const { data: slipsData, error: slipsError } = await supabase
          .from('dock_slips')
          .select('*')
          .order('slip_number')
        
        if (slipsError) throw slipsError
        
        // Fetch waitlist entries
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('waitlist')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (waitlistError) throw waitlistError

        // Fetch current occupants
        const { data: occupantsData, error: occupantsError } = await supabase
          .from('current_occupants')
          .select('*')
        
        if (occupantsError) throw occupantsError
        
        // Validate and clean waitlist data
        const validatedWaitlistData = (waitlistData || []).map(entry => ({
          ...entry,
          selected_slips: Array.isArray(entry.selected_slips) ? entry.selected_slips : [],
          boat_length: entry.boat_length || 0,
          status: entry.status || 'pending'
        }))
        
        console.log('Raw waitlist data:', waitlistData)
        console.log('Validated waitlist data:', validatedWaitlistData)
        console.log('Current occupants:', occupantsData)
        
        setSlips(slipsData || [])
        setWaitlistEntries(validatedWaitlistData)
        setCurrentOccupants(occupantsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [])

  const handleUpdateOccupant = async (updatedOccupant: CurrentOccupant) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('current_occupants')
        .update(updatedOccupant)
        .eq('id', updatedOccupant.id)
      
      if (error) throw error
      
      // Update local state
      setCurrentOccupants(prev => 
        prev.map(occupant => 
          occupant.id === updatedOccupant.id ? updatedOccupant : occupant
        )
      )
      
      alert('Occupant information updated successfully!')
    } catch (error) {
      console.error('Error updating occupant:', error)
      alert('Failed to update occupant information')
    }
  }

  const handleDuplicateEntry = async (entry: WaitlistEntry, targetSlipId: string) => {
    try {
      const supabase = createClient()
      
      // Create a new entry with the target slip
      const newEntry = {
        ...entry,
        id: undefined, // Let Supabase generate new ID
        selected_slips: [targetSlipId],
        created_at: new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('waitlist')
        .insert(newEntry)
      
      if (error) throw error
      
      // Refresh data
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (waitlistError) throw waitlistError
      
      const validatedWaitlistData = (waitlistData || []).map(entry => ({
        ...entry,
        selected_slips: Array.isArray(entry.selected_slips) ? entry.selected_slips : [],
        boat_length: entry.boat_length || 0,
        status: entry.status || 'pending'
      }))
      
      setWaitlistEntries(validatedWaitlistData)
      alert('Entry duplicated successfully!')
    } catch (error) {
      console.error('Error duplicating entry:', error)
      alert('Failed to duplicate entry')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading waitlist pipeline...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes('Authentication') && (
            <a 
              href="/auth/login" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </a>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PipelineView 
        slips={slips} 
        waitlistEntries={waitlistEntries}
        currentOccupants={currentOccupants}
        onUpdateOccupant={handleUpdateOccupant}
        onDuplicateEntry={handleDuplicateEntry}
      />
    </div>
  )
}
