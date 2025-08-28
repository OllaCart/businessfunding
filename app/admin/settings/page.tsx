"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export default function AdminSettingsPage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [archiveStats, setArchiveStats] = useState({
    totalUsers: 0,
    waitlistCount: 0,
    contactCount: 0,
    emailCampaigns: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth/login')
        return
      }

      // Check if user is admin
      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (adminError || !adminProfile) {
        router.push('/auth/login')
        return
      }

      setCurrentAdmin(adminProfile)

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

    } catch (err) {
      console.error('Error checking admin status:', err)
      setError('Failed to verify admin status')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              <Button onClick={() => router.push('/admin')} className="mt-4">
                Back to Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You don't have permission to access this page.</p>
              <Button onClick={() => router.push('/admin')} className="mt-4">
                Back to Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your admin account and marina settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Admin Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Admin Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={currentAdmin.email}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={currentAdmin.full_name || ''}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={currentAdmin.role}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="createdAt">Member Since</Label>
                <Input
                  id="createdAt"
                  value={new Date(currentAdmin.created_at).toLocaleDateString()}
                  disabled
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Database & Archive System */}
          <Card>
            <CardHeader>
              <CardTitle>Database & Archive System</CardTitle>
              <p className="text-sm text-muted-foreground">
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
                  onClick={() => router.push('/admin/archive')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📊 View User Archive
                </Button>
                <Button 
                  onClick={() => router.push('/admin/archive')}
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                className="w-full"
              >
                Back to Admin Dashboard
              </Button>
              <Button
                onClick={() => router.push('/admin/slips')}
                variant="outline"
                className="w-full"
              >
                Manage Slips
              </Button>
              <Button
                onClick={() => router.push('/admin/posts')}
                variant="outline"
                className="w-full"
              >
                Manage Posts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
