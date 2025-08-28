"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { generateSecureToken } from '@/lib/security'

interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'pending_admin'
  created_at: string
}

interface AdminInvitation {
  id: string
  email: string
  full_name: string
  invited_by: string
  token: string
  expires_at: string
  status: string
  created_at: string
}

export default function AdminSettingsPage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null)
  const [allAdmins, setAllAdmins] = useState<AdminProfile[]>([])
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
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
  
  // Admin invitation form
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    message: ''
  })
  const [isInviting, setIsInviting] = useState(false)

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

        setUser(currentUser)

        // Fetch current admin profile
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (profileError) {
          console.error('Error fetching admin profile:', profileError)
          setError('Failed to fetch admin profile. Please try again.')
          setLoading(false)
          return
        }

        if (!adminProfile) {
          setError('Admin profile not found. Please contact system administrator.')
          setLoading(false)
          return
        }

        setCurrentAdmin(adminProfile)
        setEditName(adminProfile.full_name || '')

        // Fetch all admin profiles
        const { data: allAdminsData, error: adminsError } = await supabase
          .from('admin_profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (adminsError) {
          console.error('Error fetching admin profiles:', adminsError)
          // Don't fail the whole page for this
        } else {
          setAllAdmins(allAdminsData || [])
        }

        // Fetch admin invitations
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('admin_invitations')
          .select('*')
          .order('created_at', { ascending: false })

        if (invitationsError) {
          console.error('Error fetching invitations:', invitationsError)
          // Don't fail the whole page for this
        } else {
          setInvitations(invitationsData || [])
        }

        // Fetch archive stats
        try {
          const { data: statsData, error: statsError } = await supabase
            .from('user_archive')
            .select('*', { count: 'exact' })

          if (!statsError && statsData) {
            setArchiveStats(prev => ({
              ...prev,
              totalUsers: statsData.length || 0
            }))
          }
        } catch (statsError) {
          console.warn('Could not fetch archive stats:', statsError)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error in checkAuthAndFetchData:', error)
        setError('An unexpected error occurred. Please try again.')
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [])

  const handleUpdateName = async () => {
    if (!currentAdmin || !editName.trim()) return

    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ full_name: editName.trim() })
        .eq('id', currentAdmin.id)
      
      if (updateError) throw updateError
      
      setCurrentAdmin(prev => prev ? { ...prev, full_name: editName.trim() } : null)
      setIsEditing(false)
      alert('Name updated successfully!')
    } catch (error) {
      console.error('Error updating name:', error)
      alert('Failed to update name. Please try again.')
    }
  }

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAdmin || !inviteForm.fullName || !inviteForm.email) {
      alert('Please fill in all required fields')
      return
    }

    setIsInviting(true)

    try {
      const supabase = createClient()

      // Generate secure token
      const token = generateSecureToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

      // Create invitation
      const { error: inviteError } = await supabase
        .from('admin_invitations')
        .insert({
          email: inviteForm.email,
          full_name: inviteForm.fullName,
          invited_by: currentAdmin.id,
          token: token,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })

      if (inviteError) throw inviteError

      // Send invitation email through API route
      try {
        const response = await fetch('/api/send-admin-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inviteForm.email,
            full_name: inviteForm.fullName,
            invited_by_name: currentAdmin.full_name || 'Marina Administrator',
            token: token,
            expires_at: expiresAt.toISOString(),
            message: inviteForm.message
          }),
        })

        if (!response.ok) {
          throw new Error(`Email API responded with status: ${response.status}`)
        }

        // Show success message
        alert(`Admin invitation sent successfully!

Invitation Details:
- Name: ${inviteForm.fullName}
- Email: ${inviteForm.email}
- Expires: ${expiresAt.toLocaleDateString()}

The invited user has received an email with setup instructions. They will be able to set their own password and complete the setup process.`)

      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError)
        
        // Show success but warn about email
        alert(`Admin invitation created successfully!

Invitation Details:
- Name: ${inviteForm.fullName}
- Email: ${inviteForm.email}
- Expires: ${expiresAt.toLocaleDateString()}

⚠️ WARNING: The invitation email could not be sent due to email configuration issues. You may need to manually share the setup URL with the invited user.

Setup URL: ${window.location.origin}/auth/setup-admin?token=${token}`)
      }

      // Reset form
      setInviteForm({ fullName: '', email: '', message: '' })

      // Refresh invitations list
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!invitationsError) {
        setInvitations(invitationsData || [])
      }

    } catch (error: any) {
      console.error('Error creating invitation:', error)
      alert(`Failed to create invitation: ${error.message}`)
    } finally {
      setIsInviting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin settings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.href = '/auth/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (!currentAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-yellow-600 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <Button onClick={() => window.location.href = '/auth/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">Manage your admin profile and system settings</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Admin Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <p className="text-sm text-gray-600">
            Manage your personal admin account information
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                value={currentAdmin.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <Label htmlFor="admin-role">Role</Label>
              <Input
                id="admin-role"
                value={currentAdmin.role === 'admin' ? 'Administrator' : 'Pending Admin'}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentAdmin.role === 'pending_admin' 
                  ? 'Your account is pending approval' 
                  : 'You have full administrative access'
                }
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="admin-name">Full Name</Label>
            <div className="flex gap-2">
              <Input
                id="admin-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={!isEditing}
                className="flex-1"
              />
              {isEditing ? (
                <>
                  <Button onClick={handleUpdateName} size="sm">
                    Save
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditName(currentAdmin.full_name || '')
                      setIsEditing(false)
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Account Created:</strong> {new Date(currentAdmin.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Invite New Admin */}
      <Card>
        <CardHeader>
          <CardTitle>Invite New Admin</CardTitle>
          <p className="text-sm text-gray-600">
            Send an invitation to create a new admin account. The user will set their own password.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invite-name">Full Name *</Label>
                <Input
                  id="invite-name"
                  value={inviteForm.fullName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="invite-email">Email Address *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="invite-message">Personal Message (Optional)</Label>
              <Textarea
                id="invite-message"
                value={inviteForm.message}
                onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal message for the invitation..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!inviteForm.fullName || !inviteForm.email || isInviting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isInviting ? "Creating Invitation..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <p className="text-sm text-gray-600">
              Track admin invitations and their status
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📧</span>
                    </div>
                    <div>
                      <div className="font-medium">{invitation.full_name}</div>
                      <div className="text-sm text-gray-500">{invitation.email}</div>
                      <div className="text-xs text-gray-400">
                        Invited: {new Date(invitation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      invitation.status === 'pending' ? 'default' : 
                      invitation.status === 'used' ? 'secondary' : 'destructive'
                    }>
                      {invitation.status === 'pending' ? 'Pending' : 
                       invitation.status === 'used' ? 'Used' : 'Expired'}
                    </Badge>
                    {invitation.status === 'pending' && (
                      <div className="text-xs text-gray-500">
                        Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <p className="text-sm text-gray-600">
            Current system status and user counts
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{allAdmins.length}</div>
              <div className="text-sm text-blue-800">Total Admins</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{archiveStats.totalUsers}</div>
              <div className="text-sm text-green-800">Archived Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{invitations.filter(i => i.status === 'pending').length}</div>
              <div className="text-sm text-purple-800">Pending Invitations</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">-</div>
              <div className="text-sm text-orange-800">System Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <p className="text-sm text-gray-600">
            View all admin accounts in the system
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {admin.full_name?.charAt(0) || admin.email.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{admin.full_name || 'No name set'}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={admin.role === 'admin' ? 'default' : 'secondary'}>
                    {admin.role === 'admin' ? 'Administrator' : 'Pending'}
                  </Badge>
                  {admin.id === currentAdmin.id && (
                    <Badge variant="outline">You</Badge>
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
            Manage user archives and system data
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  )
}
