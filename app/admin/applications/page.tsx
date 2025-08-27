"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Eye, CheckCircle, XCircle, Clock, AlertCircle, FileText, User, Boat, CreditCard } from 'lucide-react'

interface OccupantApplication {
  id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed'
  owner_names: string
  owner_email: string
  owner_mailing_address: string
  owner_phone_numbers: string
  owner_drivers_license: string
  owner_drivers_license_state: string
  vehicle_license_plates: string
  boat_operators: string
  boat_name: string
  boat_make: string
  boat_model: string
  boat_year: number
  boat_length: number
  boat_draft: number
  boat_beam: number
  boat_registration_number: string
  cost_per_foot: number
  monthly_taxes: number
  total_monthly_cost: number
  slip_number: string
  primary_payment_method: 'ACH' | 'Credit Card'
  starting_date: string
  estimated_end_date: string
  admin_notes: string
  submitted_at: string
  reviewed_at: string
  reviewed_by: string
  slip_offer?: {
    id: string
    offered_price_per_foot: number
    total_monthly_cost: number
    offer_expires_at: string
    status: string
  }
  payment_methods?: {
    id: string
    payment_type: 'ACH' | 'Credit Card'
    bank_name?: string
    account_holder_name?: string
    account_type?: string
    card_last_four?: string
    card_brand?: string
    card_expiry_month?: number
    card_expiry_year?: number
  }[]
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<OccupantApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<OccupantApplication | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [adminNotes, setAdminNotes] = useState('')
  const [newStatus, setNewStatus] = useState<string>('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('occupant_applications')
        .select(`
          id,
          status,
          owner_names,
          owner_email,
          owner_mailing_address,
          owner_phone_numbers,
          owner_drivers_license,
          owner_drivers_license_state,
          vehicle_license_plates,
          boat_operators,
          boat_name,
          boat_make,
          boat_model,
          boat_year,
          boat_length,
          boat_draft,
          boat_beam,
          boat_registration_number,
          cost_per_foot,
          monthly_taxes,
          total_monthly_cost,
          slip_number,
          primary_payment_method,
          starting_date,
          estimated_end_date,
          admin_notes,
          submitted_at,
          reviewed_at,
          reviewed_by
        `)
        .order('submitted_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching applications:', fetchError)
        setError('Failed to load applications')
        return
      }

      // Safely set the applications with proper data validation
      const validApplications = (data || []).map(app => ({
        ...app,
        status: app.status || 'pending',
        owner_names: app.owner_names || 'Unknown',
        owner_email: app.owner_email || '',
        boat_name: app.boat_name || '',
        boat_make: app.boat_make || '',
        boat_model: app.boat_model || '',
        boat_year: app.boat_year || new Date().getFullYear(),
        boat_length: app.boat_length || 0,
        boat_draft: app.boat_draft || 0,
        boat_beam: app.boat_beam || 0,
        cost_per_foot: app.cost_per_foot || 0,
        monthly_taxes: app.monthly_taxes || 0,
        total_monthly_cost: app.total_monthly_cost || 0,
        slip_number: app.slip_number || '',
        primary_payment_method: app.primary_payment_method || 'ACH',
        starting_date: app.starting_date || '',
        estimated_end_date: app.estimated_end_date || '',
        admin_notes: app.admin_notes || '',
        submitted_at: app.submitted_at || new Date().toISOString(),
        reviewed_at: app.reviewed_at || '',
        reviewed_by: app.reviewed_by || '',
        vehicle_license_plates: app.vehicle_license_plates || '',
        boat_operators: app.boat_operators || '',
        owner_mailing_address: app.owner_mailing_address || '',
        owner_phone_numbers: app.owner_phone_numbers || '',
        owner_drivers_license: app.owner_drivers_license || '',
        owner_drivers_license_state: app.owner_drivers_license_state || '',
        boat_registration_number: app.boat_registration_number || ''
      }))

      setApplications(validApplications)
    } catch (error) {
      console.error('Error in fetchApplications:', error)
      setError('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string, notes: string) => {
    try {
      const supabase = createClient()
      
      // Update the application status in the database first
      const { error: updateError } = await supabase
        .from('occupant_applications')
        .update({
          status: newStatus,
          admin_notes: notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id || 'admin'
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Error updating application status:', updateError)
        alert('Failed to update application status')
        return
      }

      // Try to send notification email (but don't fail if it doesn't work)
      try {
        const notificationResponse = await fetch('/api/application-notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId,
            newStatus,
            adminNotes: notes
          })
        })

        if (!notificationResponse.ok) {
          console.warn('Failed to send notification email, but status was updated successfully')
        }
      } catch (emailError) {
        console.warn('Email notification failed:', emailError)
      }

      // If status is completed, try to call the complete onboarding function
      if (newStatus === 'completed') {
        try {
          const { error: completeError } = await supabase
            .rpc('complete_onboarding', { 
              p_occupant_application_id: applicationId,
              p_admin_id: (await supabase.auth.getUser()).data.user?.id || 'admin'
            })

          if (completeError) {
            console.warn('Failed to complete onboarding:', completeError)
          }
        } catch (rpcError) {
          console.warn('RPC call failed:', rpcError)
        }
      }

      // Refresh applications
      await fetchApplications()
      
      // Reset dialog state
      setStatusUpdateDialog(false)
      setSelectedApplication(null)
      setAdminNotes('')
      setNewStatus('')

      // Show success message
      alert(`Application status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating application status:', error)
      alert('Failed to update application status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'under_review': return <Eye className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredApplications = applications.filter(app => {
    if (!app) return false
    
    const matchesSearch = 
      (app.owner_names || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.owner_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.slip_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.boat_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return applications.filter(app => app && app.status === status).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Applications</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchApplications}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Occupant Applications</h1>
          <p className="text-muted-foreground">
            Review and manage applications from boaters seeking slip occupancy
          </p>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{getStatusCount('pending')}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">{getStatusCount('under_review')}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{getStatusCount('approved')}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{getStatusCount('completed')}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, slip number, or boat name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            if (!application) return null
            
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {application.owner_names || 'Unknown'}
                          </h3>
                          <p className="text-muted-foreground">{application.owner_email || 'No email'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(application.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {application.status.replace('_', ' ')}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Slip:</span> {application.slip_number || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Boat:</span> {application.boat_make || 'N/A'} {application.boat_model || ''} ({application.boat_year || 'N/A'})
                        </div>
                        <div>
                          <span className="font-medium">Monthly Cost:</span> ${(application.total_monthly_cost || 0).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        Submitted: {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'Unknown'}
                        {application.reviewed_at && (
                          <span className="ml-4">
                            Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application)
                          setReviewDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application)
                          setStatusUpdateDialog(true)
                          setNewStatus(application.status)
                          setAdminNotes(application.admin_notes || '')
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {applications.length === 0 
                  ? 'No applications have been submitted yet.'
                  : 'No applications match your current filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application - {selectedApplication?.owner_names || 'Unknown'}</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Status and Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {selectedApplication.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Slip {selectedApplication.slip_number || 'N/A'} • ${(selectedApplication.total_monthly_cost || 0).toFixed(2)}/month
                  </p>
                </div>
                
                <Button
                  onClick={() => {
                    setReviewDialog(false)
                    setStatusUpdateDialog(true)
                    setNewStatus(selectedApplication.status)
                    setAdminNotes(selectedApplication.admin_notes || '')
                  }}
                >
                  Update Status
                </Button>
              </div>

              {/* Boat Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Boat Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name(s)</Label>
                      <p className="text-sm">{selectedApplication.owner_names || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedApplication.owner_email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Mailing Address</Label>
                    <p className="text-sm">{selectedApplication.owner_mailing_address || 'N/A'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Phone Number(s)</Label>
                      <p className="text-sm">{selectedApplication.owner_phone_numbers || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Driver's License</Label>
                      <p className="text-sm">{selectedApplication.owner_drivers_license || 'N/A'} ({selectedApplication.owner_drivers_license_state || 'N/A'})</p>
                    </div>
                  </div>
                  
                  {selectedApplication.vehicle_license_plates && (
                    <div>
                      <Label className="text-sm font-medium">Vehicle License Plate(s)</Label>
                      <p className="text-sm">{selectedApplication.vehicle_license_plates}</p>
                    </div>
                  )}
                  
                  {selectedApplication.boat_operators && (
                    <div>
                      <Label className="text-sm font-medium">Additional Boat Operators</Label>
                      <p className="text-sm">{selectedApplication.boat_operators}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Boat Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Boat className="h-5 w-5" />
                    Boat Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Boat Name</Label>
                      <p className="text-sm">{selectedApplication.boat_name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Make & Model</Label>
                      <p className="text-sm">{selectedApplication.boat_make || 'N/A'} {selectedApplication.boat_model || ''}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Year</Label>
                      <p className="text-sm">{selectedApplication.boat_year || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Length</Label>
                      <p className="text-sm">{selectedApplication.boat_length || 'N/A'}'</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Draft</Label>
                      <p className="text-sm">{selectedApplication.boat_draft || 'N/A'}'</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Beam</Label>
                      <p className="text-sm">{selectedApplication.boat_beam || 'N/A'}'</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Registration Number</Label>
                    <p className="text-sm">{selectedApplication.boat_registration_number || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <p className="text-sm">{selectedApplication.primary_payment_method || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Starting Date</Label>
                      <p className="text-sm">{selectedApplication.starting_date ? new Date(selectedApplication.starting_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              {selectedApplication.admin_notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedApplication.admin_notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onOpenChange={setStatusUpdateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this application..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setStatusUpdateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedApplication && newStatus) {
                    updateApplicationStatus(selectedApplication.id, newStatus, adminNotes)
                  }
                }}
                disabled={!newStatus}
              >
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
