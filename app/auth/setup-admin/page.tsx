"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { generateSecureToken } from '@/lib/security'

interface Invitation {
  id: string
  email: string
  full_name: string
  invited_by: string
  token: string
  expires_at: string
  status: string
}

export default function SetupAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided')
      setLoading(false)
      return
    }

    validateInvitation()
  }, [token])

  const validateInvitation = async () => {
    try {
      const supabase = createClient()
      
      // Check if invitation exists and is valid
      const { data: invitationData, error: invitationError } = await supabase
        .from('admin_invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (invitationError || !invitationData) {
        setError('Invalid or expired invitation token')
        setLoading(false)
        return
      }

      // Check if invitation has expired
      if (new Date(invitationData.expires_at) < new Date()) {
        setError('This invitation has expired')
        setLoading(false)
        return
      }

      setInvitation(invitationData)
      setLoading(false)
    } catch (error) {
      console.error('Error validating invitation:', error)
      setError('Failed to validate invitation')
      setLoading(false)
    }
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!invitation) return

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSettingUp(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create the user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: password,
        options: {
          data: {
            full_name: invitation.full_name,
            role: 'pending_admin'
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create admin profile
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert({
          id: authData.user.id,
          email: invitation.email,
          full_name: invitation.full_name,
          role: 'pending_admin'
        })

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        // But for now, just show the error
        throw profileError
      }

      // Mark invitation as used
      const { error: updateError } = await supabase
        .from('admin_invitations')
        .update({ 
          status: 'used',
          expires_at: new Date().toISOString()
        })
        .eq('id', invitation.id)

      if (updateError) {
        console.warn('Failed to mark invitation as used:', updateError)
        // Don't fail the setup for this
      }

      setSuccess(true)
      
      // Auto-login the user
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (error: any) {
      console.error('Error setting up admin account:', error)
      setError(error.message || 'Failed to setup admin account')
    } finally {
      setIsSettingUp(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/auth/login')}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Created!</h1>
              <p className="text-gray-600 mb-6">
                Your admin account has been created successfully. You will be redirected to the admin panel shortly.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invitation) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Setup Admin Account</CardTitle>
          <p className="text-gray-600">
            Complete your admin account setup for Marina By-The-Sea
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Invitation Details</h3>
            <div className="text-sm text-blue-700">
              <p><strong>Name:</strong> {invitation.full_name}</p>
              <p><strong>Email:</strong> {invitation.email}</p>
              <p><strong>Expires:</strong> {new Date(invitation.expires_at).toLocaleDateString()}</p>
            </div>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={!password || !confirmPassword || isSettingUp}
            >
              {isSettingUp ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600"
                onClick={() => router.push('/auth/login')}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
