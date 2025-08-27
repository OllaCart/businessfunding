"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'pending_admin'
  created_at: string
  approved_by?: string
  approved_at?: string
}

interface AdminRequest {
  id: string
  email: string
  full_name: string
  role: 'pending_admin' | 'pending_approval'
  created_at: string
  message?: string
  approved_by?: string
  approved_at?: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
}

export default function AdminSettingsPage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null)
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([])
  const [allAdmins, setAllAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [archiveStats, setArchiveStats] = useState({
    totalUsers: 0,
    waitlistCount: 0,
    contactCount: 0,
    emailCampaigns: 0
  })
  
  // Form states
  const [editName, setEditName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [approvalDialog, setApprovalDialog] = useState<{
    isOpen: boolean
    request: AdminRequest | null
    message: string
  }>({
    isOpen: false,
    request: null,
    message: ''
  })

  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean
    request: AdminRequest | null
    reason: string
  }>({
    isOpen: false,
    request: null,
    reason: ''
  })

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

        if (adminError || !adminProfile || adminProfile.role !== 'admin') {
          setError('Admin access required.')
          setLoading(false)
          return
        }

        setUser(currentUser)
        setCurrentAdmin(adminProfile)
        setEditName(adminProfile.full_name)
        
        // Fetch all admin profiles
        const { data: allAdminsData, error: adminsError } = await supabase
          .from('admin_profiles')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (adminsError) throw adminsError
        
        setAllAdmins(allAdminsData || [])
        
        // Filter pending admin requests
        const pendingRequests = (allAdminsData || []).filter(admin => admin.role === 'pending_admin')
        setAdminRequests(pendingRequests)
        
        // Fetch archive statistics
        await fetchArchiveStats()
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const fetchArchiveStats = async () => {
      try {
        const response = await fetch('/api/archive-stats')
        if (response.ok) {
          const stats = await response.json()
          setArchiveStats(stats)
        }
      } catch (error) {
        console.error('Error fetching archive stats:', error)
        // Don't fail the whole page if archive stats fail
      }
    }

    checkAuthAndFetchData()
  }, [])

  const handleUpdateName = async () => {
    if (!currentAdmin || !editName.trim()) return
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('admin_profiles')
        .update({ full_name: editName.trim() })
        .eq('id', currentAdmin.id)
      
      if (error) throw error
      
      // Update local state
      setCurrentAdmin(prev => prev ? { ...prev, full_name: editName.trim() } : null)
      setAllAdmins(prev => prev.map(admin => 
        admin.id === currentAdmin.id ? { ...admin, full_name: editName.trim() } : admin
      ))
      
      setIsEditing(false)
      alert('Name updated successfully!')
    } catch (error) {
      console.error('Error updating name:', error)
      alert('Failed to update name. Please try again.')
    }
  }

  const handleApproveAdmin = async (request: AdminRequest, message: string) => {
    try {
      const supabase = createClient()
      
      // First step: Approve the admin creation request
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ 
          role: 'pending_approval',
          approved_by: currentAdmin?.id,
          approved_at: new Date().toISOString(),
          status: 'approved'
        })
        .eq('id', request.id)
      
      if (updateError) throw updateError
      
      // Send approval email
      await sendApprovalEmail(request.email, request.full_name, message)
      
      // Refresh data
      const { data: allAdminsData, error: adminsError } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (adminsError) throw adminsError
      
      setAllAdmins(allAdminsData || [])
      const pendingRequests = (allAdminsData || []).filter(admin => 
        admin.role === 'pending_admin' || admin.role === 'pending_approval'
      )
      setAdminRequests(pendingRequests)
      
      setApprovalDialog({ isOpen: false, request: null, message: '' })
      alert('Admin creation request approved! The user can now create their account.')
    } catch (error) {
      console.error('Error approving admin request:', error)
      alert('Failed to approve admin request. Please try again.')
    }
  }

  const handleRejectAdmin = async (request: AdminRequest, reason: string) => {
    try {
      const supabase = createClient()
      
      // Reject the admin creation request
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ 
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', request.id)
      
      if (updateError) throw updateError
      
      // Send rejection email
      await sendRejectionEmail(request.email, request.full_name, reason)
      
      // Refresh data
      const { data: allAdminsData, error: adminsError } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (adminsError) throw adminsError
      
      setAllAdmins(allAdminsData || [])
      const pendingRequests = (allAdminsData || []).filter(admin => 
        admin.role === 'pending_admin' || admin.role === 'pending_approval'
      )
      setAdminRequests(pendingRequests)
      
      alert('Admin creation request rejected successfully.')
    } catch (error) {
      console.error('Error rejecting admin request:', error)
      alert('Failed to reject admin request. Please try again.')
    }
  }

  const handleGrantAccess = async (request: AdminRequest) => {
    try {
      const supabase = createClient()
      
      // Grant full admin access
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ 
          role: 'admin',
          status: 'active'
        })
        .eq('id', request.id)
      
      if (updateError) throw updateError
      
      // Send access granted email
      await sendAccessGrantedEmail(request.email, request.full_name)
      
      // Refresh data
      const { data: allAdminsData, error: adminsError } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (adminsError) throw adminsError
      
      setAllAdmins(allAdminsData || [])
      const pendingRequests = (allAdminsData || []).filter(admin => 
        admin.role === 'pending_admin' || admin.role === 'pending_approval'
      )
      setAdminRequests(pendingRequests)
      
      alert('Admin access granted successfully!')
    } catch (error) {
      console.error('Error granting admin access:', error)
      alert('Failed to grant admin access. Please try again.')
    }
  }

  const sendApprovalEmail = async (email: string, fullName: string, message: string) => {
    try {
      const response = await fetch('/api/send-admin-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Admin Access Approved - Marina By-The-Sea',
          content: `Dear ${fullName},

Your admin access request has been approved! You now have full administrative access to the Marina By-The-Sea management system.

${message ? `\nMessage from approver: ${message}` : ''}

You can now:
- Manage dock slips and availability
- Process waitlist applications
- Edit blog posts and content
- Approve other admin requests
- Access all administrative functions

Welcome to the team!

Best regards,
The Marina By-The-Sea Administration Team`,
          fromName: currentAdmin?.full_name || 'Admin'
        })
      })

      if (!response.ok) {
        console.warn('Failed to send approval email, but admin was approved')
      }
    } catch (error) {
      console.warn('Failed to send approval email:', error)
    }
  }

  const sendRejectionEmail = async (email: string, fullName: string, reason: string) => {
    try {
      const response = await fetch('/api/send-admin-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Admin Access Rejected - Marina By-The-Sea',
          content: `Dear ${fullName},

Your admin access request has been rejected.

Reason: ${reason}

If you believe this is an error, please contact the administrator.

Best regards,
The Marina By-The-Sea Administration Team`,
          fromName: currentAdmin?.full_name || 'Admin'
        })
      })

      if (!response.ok) {
        console.warn('Failed to send rejection email, but admin was rejected')
      }
    } catch (error) {
      console.warn('Failed to send rejection email:', error)
    }
  }

  const sendAccessGrantedEmail = async (email: string, fullName: string) => {
    try {
      const response = await fetch('/api/send-admin-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Admin Access Granted - Marina By-The-Sea',
          content: `Dear ${fullName},

Your admin access request has been granted! You now have full administrative access to the Marina By-The-Sea management system.

You can now:
- Manage dock slips and availability
- Process waitlist applications
- Edit blog posts and content
- Approve other admin requests
- Access all administrative functions

Welcome to the team!

Best regards,
The Marina By-The-Sea Administration Team`,
          fromName: currentAdmin?.full_name || 'Admin'
        })
      })

      if (!response.ok) {
        console.warn('Failed to send access granted email, but admin was granted')
      }
    } catch (error) {
      console.warn('Failed to send access granted email:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin settings...</p>
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

  if (!user || !currentAdmin) {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <div className="text-sm text-gray-600">
            Logged in as: {currentAdmin.full_name}
          </div>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={currentAdmin.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Input
                      id="full-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <Button onClick={handleUpdateName} size="sm">
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false)
                        setEditName(currentAdmin.full_name)
                      }} 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input
                      id="full-name"
                      value={currentAdmin.full_name}
                      disabled
                      className="bg-gray-50"
                    />
                    <Button onClick={() => setIsEditing(true)} size="sm">
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Requests */}
        {adminRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Admin Requests ({adminRequests.length})</CardTitle>
              <p className="text-sm text-gray-600">
                Step 1: Approve creation request • Step 2: Grant access after account creation
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{request.full_name}</div>
                      <div className="text-sm text-gray-600">{request.email}</div>
                      <div className="text-xs text-gray-500">
                        Requested: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      {request.message && (
                        <div className="text-sm text-gray-700 mt-1">
                          <strong>Message:</strong> {request.message}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={
                          request.role === 'pending_admin' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }>
                          {request.role === 'pending_admin' ? 'Pending Approval' : 'Approved - Grant Access'}
                        </Badge>
                        {request.approved_by && (
                          <span className="text-xs text-gray-500">
                            Approved by: {allAdmins.find(a => a.id === request.approved_by)?.full_name || 'Unknown'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {request.role === 'pending_admin' ? (
                        // Step 1: Approve the creation request
                        <>
                          <Button
                            onClick={() => setApprovalDialog({
                              isOpen: true,
                              request,
                              message: ''
                            })}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✅ Approve Creation
                          </Button>
                          <Button
                            onClick={() => setRejectionDialog({
                              isOpen: true,
                              request,
                              reason: ''
                            })}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            ❌ Reject
                          </Button>
                        </>
                      ) : request.role === 'pending_approval' ? (
                        // Step 2: Grant full access
                        <>
                          <Button
                            onClick={() => handleGrantAccess(request)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            🔓 Grant Access
                          </Button>
                          <Button
                            onClick={() => setRejectionDialog({
                              isOpen: true,
                              request,
                              reason: ''
                            })}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            ❌ Revoke Approval
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Admins */}
        <Card>
          <CardHeader>
            <CardTitle>Current Administrators ({allAdmins.filter(a => a.role === 'admin').length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allAdmins
                .filter(admin => admin.role === 'admin')
                .map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{admin.full_name}</div>
                        <div className="text-sm text-gray-600">{admin.email}</div>
                      </div>
                      {admin.id === currentAdmin.id && (
                        <Badge className="bg-blue-100 text-blue-800">You</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {admin.approved_at ? (
                          `Approved: ${new Date(admin.approved_at).toLocaleDateString()}`
                        ) : (
                          'Original Admin'
                        )}
                      </div>
                      {admin.approved_by && (
                        <div className="text-xs text-gray-500">
                          by: {allAdmins.find(a => a.id === admin.approved_by)?.full_name || 'Unknown'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Database & Archive System */}
        <Card>
          <CardHeader>
            <CardTitle>Database & Archive System</CardTitle>
            <p className="text-sm text-gray-600">
              Manage user archives, email lists, and bulk communications
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{archiveStats.totalUsers}</div>
                <div className="text-sm text-blue-800">Total Archived Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{archiveStats.waitlistCount}</div>
                <div className="text-sm text-green-800">Waitlist Archive</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{archiveStats.contactCount}</div>
                <div className="text-sm text-purple-800">Contact Archive</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{archiveStats.emailCampaigns}</div>
                <div className="text-sm text-orange-800">Email Campaigns</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => window.open('/admin/archive', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📊 View User Archive
              </Button>
              <Button 
                onClick={() => window.open('/admin/email-campaigns', '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                📧 Manage Email Campaigns
              </Button>
              <Button 
                onClick={() => window.open('/admin/archive/export', '_blank')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                📥 Export to Excel
              </Button>
            </div>

            {/* Setup Instructions */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Database Setup Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                The archive system needs to be initialized in your Supabase database. 
                Run the SQL script <code className="bg-yellow-100 px-1 rounded">scripts/017_create_archive_tables.sql</code> to set up the required tables.
              </p>
              <div className="text-xs text-yellow-600">
                <strong>What this creates:</strong> User archive tables, email campaign management, 
                automatic archiving triggers for waitlist and contact submissions.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.isOpen} onOpenChange={(open) => 
        setApprovalDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Admin Creation Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Two-Step Process:</strong><br/>
                1. This approval allows the user to create their admin account<br/>
                2. After account creation, you'll need to grant full access
              </p>
            </div>
            
            <div>
              <Label htmlFor="approval-message">Approval Message (Optional)</Label>
              <textarea
                id="approval-message"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Add a personal message for the new admin..."
                value={approvalDialog.message}
                onChange={(e) => setApprovalDialog(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setApprovalDialog({ isOpen: false, request: null, message: '' })}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (approvalDialog.request) {
                    handleApproveAdmin(approvalDialog.request, approvalDialog.message)
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Creation Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.isOpen} onOpenChange={(open) => 
        setRejectionDialog(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Admin Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <textarea
                id="rejection-reason"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter the reason for rejecting this admin request..."
                value={rejectionDialog.reason}
                onChange={(e) => setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setRejectionDialog({ isOpen: false, request: null, reason: '' })}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (rejectionDialog.request) {
                    handleRejectAdmin(rejectionDialog.request, rejectionDialog.reason)
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
