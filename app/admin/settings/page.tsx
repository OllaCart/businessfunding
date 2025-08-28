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

          {/* Admin Management Info */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Creating New Admin Accounts</h4>
                <p className="text-blue-700 text-sm mb-3">
                  To create a new admin account, use the Supabase dashboard:
                </p>
                <ol className="text-blue-700 text-sm space-y-1 ml-4">
                  <li>1. Go to Supabase Dashboard → Authentication → Users</li>
                  <li>2. Click "Add User" and create a new user</li>
                  <li>3. Copy the user ID from the created user</li>
                  <li>4. Go to SQL Editor and run:</li>
                </ol>
                <div className="bg-blue-100 border border-blue-300 rounded p-3 mt-3 font-mono text-sm">
                  INSERT INTO admin_profiles (id, email, full_name, role) VALUES ('USER_ID_HERE', 'email@example.com', 'Full Name', 'admin');
                </div>
                <p className="text-blue-700 text-sm mt-3">
                  Replace USER_ID_HERE with the actual user ID from step 3.
                </p>
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
