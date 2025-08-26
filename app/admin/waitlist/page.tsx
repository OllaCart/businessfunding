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

interface DockSlip {
  id: string
  slip_number: string
  length_capacity: number
  beam_capacity: number
  monthly_rate: number
  is_available: boolean
  show_price: boolean
  amenities: string[]
  occupant_name?: string
  occupant_email?: string
  occupant_phone?: string
  contract_end_date?: string
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

function PipelineView({ slips, waitlistEntries }: { slips: DockSlip[], waitlistEntries: WaitlistEntry[] }) {
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

  const [emailContent, setEmailContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetSlipId: string | null) => {
    e.preventDefault()
    
    if (!draggedEntry) return

    // Here you would update the database to move the entry
    // For now, we'll just log the action
    console.log(`Moving entry ${draggedEntry.full_name} to ${targetSlipId || 'general'}`)
    
    // TODO: Implement database update
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

  const getOccupiedEntries = () => {
    return slips
      .filter(slip => !slip.is_available)
      .map(slip => ({
        id: `occupied-${slip.id}`,
        full_name: slip.occupant_name || 'Unknown',
        email: slip.occupant_email || 'No email',
        phone: slip.occupant_phone || 'No phone',
        boat_length: 0,
        selected_slips: [],
        message: '',
        status: 'converted' as const,
        created_at: new Date().toISOString(),
        contract_end_date: slip.contract_end_date
      }))
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Waitlist Pipeline</h1>
        <div className="text-sm text-gray-600">
          {waitlistEntries.length} entries • {slips.length} slips
        </div>
      </div>

      {/* Pipeline Rows */}
      <div className="space-y-6">
        {/* General Interest Row */}
        <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="text-center mb-4 text-blue-700">
            <h3 className="font-bold text-lg">General Interest</h3>
            <div className="text-sm">Any Available Slip</div>
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
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => onSendEmail(entry, 'notify')}
                    >
                      📧 Status Update
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
        {slips.map(slip => (
          <div 
            key={slip.id}
            className={`border-2 border-dashed rounded-lg p-4 ${
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
        ))}

        {/* Currently Occupied Row */}
        <div className="border-2 border-dashed border-red-200 rounded-lg p-4 bg-red-50">
          <div className="text-center mb-4 text-red-700">
            <h3 className="font-bold text-lg">Currently Occupied</h3>
            <div className="text-sm">Contract Active</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {getOccupiedEntries().map((entry, index) => (
              <Card 
                key={entry.id} 
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, entry)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{entry.full_name}</div>
                    <Badge className="text-xs bg-red-100 text-red-800">Occupied</Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{entry.email}</div>
                    {entry.phone && <div>{entry.phone}</div>}
                    {entry.contract_end_date && (
                      <div className="text-red-600 font-medium">
                        Contract: {new Date(entry.contract_end_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => onSendEmail(entry, 'notify')}
                    >
                      📧 Contact Occupant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getOccupiedEntries().length === 0 && (
              <div className="text-center text-gray-500 py-8 col-span-full">
                <div className="text-2xl mb-2">📭</div>
                <div className="text-sm">No occupied slips</div>
              </div>
            )}
          </div>
        </div>
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
    </div>
  )
}

export default function AdminWaitlistPage() {
  const [slips, setSlips] = useState<DockSlip[]>([])
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
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
        
        // Validate and clean waitlist data
        const validatedWaitlistData = (waitlistData || []).map(entry => ({
          ...entry,
          selected_slips: Array.isArray(entry.selected_slips) ? entry.selected_slips : [],
          boat_length: entry.boat_length || 0,
          status: entry.status || 'pending'
        }))
        
        console.log('Raw waitlist data:', waitlistData)
        console.log('Validated waitlist data:', validatedWaitlistData)
        
        setSlips(slipsData || [])
        setWaitlistEntries(validatedWaitlistData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [])

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
      <PipelineView slips={slips} waitlistEntries={waitlistEntries} />
    </div>
  )
}
