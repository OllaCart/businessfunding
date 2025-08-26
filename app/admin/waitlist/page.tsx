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
}

interface PipelineViewProps {
  slips: DockSlip[]
  waitlistEntries: WaitlistEntry[]
}

function PipelineView({ slips, waitlistEntries }: PipelineViewProps) {
  const [emailDialog, setEmailDialog] = useState<{
    isOpen: boolean
    entry: WaitlistEntry | null
    slip: DockSlip | null
    action: 'notify' | 'call' | null
  }>({
    isOpen: false,
    entry: null,
    slip: null,
    action: null
  })

  const [emailContent, setEmailContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')

  const openEmailDialog = (entry: WaitlistEntry, slip: DockSlip, action: 'notify' | 'call') => {
    let subject = ''
    let content = ''

    if (action === 'notify') {
      subject = `Slip ${slip.slip_number} Status Update - Marina By-The-Sea`
      content = `Dear ${entry.full_name},

We wanted to update you on the status of Slip ${slip.slip_number} (${slip.length_capacity}' × ${slip.beam_capacity}').

[Your status update message here]

Best regards,
The Marina By-The-Sea Team`
    } else if (action === 'call') {
      subject = `Slip ${slip.slip_number} Available - Marina By-The-Sea`
      content = `Dear ${entry.full_name},

Great news! Slip ${slip.slip_number} (${slip.length_capacity}' × ${slip.beam_capacity}') has become available.

Please call us at (954) 790-1588 to discuss this opportunity and arrange a viewing.

Best regards,
The Marina By-The-Sea Team`
    }

    setEmailSubject(subject)
    setEmailContent(content)
    setEmailDialog({
      isOpen: true,
      entry,
      slip,
      action
    })
  }

  const sendEmail = async () => {
    if (!emailDialog.entry || !emailDialog.slip) return

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
          slipId: emailDialog.slip.id,
          action: emailDialog.action
        })
      })

      if (response.ok) {
        alert('Email sent successfully!')
        setEmailDialog({ isOpen: false, entry: null, slip: null, action: null })
      } else {
        alert('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email')
    }
  }

  const getWaitlistEntriesForSlip = (slipId: string) => {
    return waitlistEntries.filter(entry => 
      entry.selected_slips.includes(slipId)
    )
  }

  const getSlipStatusColor = (slip: DockSlip) => {
    return slip.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getEntryStatusColor = (entry: WaitlistEntry) => {
    switch (entry.status) {
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

      {/* Pipeline Grid */}
      <div className="grid gap-4" style={{ 
        gridTemplateColumns: `200px repeat(${slips.length}, 1fr)` 
      }}>
        {/* Header Row */}
        <div className="font-semibold text-gray-700 p-2">Waitlist Entries</div>
        {slips.map(slip => (
          <div key={slip.id} className="text-center font-semibold text-gray-700 p-2">
            <div className="text-lg">Slip {slip.slip_number}</div>
            <div className="text-sm text-gray-500">
              {slip.length_capacity}' × {slip.beam_capacity}'
            </div>
            <Badge className={`mt-1 ${getSlipStatusColor(slip)}`}>
              {slip.is_available ? 'Available' : 'Occupied'}
            </Badge>
          </div>
        ))}

        {/* Waitlist Entries Rows */}
        {waitlistEntries.map(entry => (
          <div key={entry.id} className="contents">
            {/* Entry Name */}
            <div className="p-3 border-r border-gray-200 bg-gray-50">
              <div className="font-medium">{entry.full_name}</div>
              <div className="text-sm text-gray-600">{entry.email}</div>
              <div className="text-xs text-gray-500">
                {entry.boat_length}' boat • {entry.status}
              </div>
              <Badge className={`mt-1 ${getEntryStatusColor(entry)}`}>
                {entry.status}
              </Badge>
            </div>

            {/* Slip Columns */}
            {slips.map(slip => {
              const isInterested = entry.selected_slips.includes(slip.id)
              const isAvailable = slip.is_available
              
              return (
                <div key={`${entry.id}-${slip.id}`} className="p-2 border-b border-gray-200">
                  {isInterested ? (
                    <div className="space-y-2">
                      <div className="text-xs text-center p-1 bg-blue-50 text-blue-700 rounded">
                        Interested
                      </div>
                      
                      {isAvailable ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => openEmailDialog(entry, slip, 'call')}
                        >
                          📞 Call to Discuss
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => openEmailDialog(entry, slip, 'notify')}
                        >
                          📧 Status Update
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 text-center p-2">
                      -
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
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
                onClick={() => setEmailDialog({ isOpen: false, entry: null, slip: null, action: null })}
              >
                Cancel
              </Button>
              <Button onClick={sendEmail}>
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
        const supabase = createClient()
        
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
        
        setSlips(slipsData || [])
        setWaitlistEntries(waitlistData || [])
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
