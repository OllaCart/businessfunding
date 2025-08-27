"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Download, Mail, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

interface ArchivedUser {
  id: string
  email: string
  full_name: string
  phone: string | null
  boat_length: number | null
  message: string | null
  source_type: 'waitlist' | 'contact' | 'former_occupant' | 'general_interest'
  source_details: any
  slip_number: string | null
  status: 'active' | 'archived' | 'unsubscribed'
  created_at: string
  archived_at: string
  last_contact_date: string
  notes: string | null
  tags: string[] | null
}

export default function ArchivePage() {
  const [users, setUsers] = useState<ArchivedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchArchivedUsers()
  }, [])

  const fetchArchivedUsers = async () => {
    try {
      const supabase = createClient()
      
      let query = supabase
        .from('user_archive')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (sourceTypeFilter !== 'all') {
        query = query.eq('source_type', sourceTypeFilter)
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching archived users:', error)
      setError('Failed to load archived users. The database tables may not be set up yet.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.message && user.message.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'waitlist': return 'bg-blue-100 text-blue-800'
      case 'contact': return 'bg-green-100 text-green-800'
      case 'former_occupant': return 'bg-purple-100 text-purple-800'
      case 'general_interest': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      case 'unsubscribed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Boat Length', 'Source Type', 'Status', 'Created', 'Notes']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.phone || '',
        user.boat_length || '',
        user.source_type,
        user.status,
        new Date(user.created_at).toLocaleDateString(),
        user.notes || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marina-archive-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading archive...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Setup Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">To set up the archive system:</h4>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Go to your Supabase SQL Editor</li>
              <li>Run the script: <code className="bg-yellow-100 px-1 rounded">scripts/017_create_archive_tables.sql</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <Link href="/admin/settings">
            <Button className="mt-4">Back to Settings</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Archive</h1>
          <p className="text-gray-600">Manage archived users and contact information</p>
        </div>
        <Link href="/admin/settings">
          <Button variant="outline">Back to Settings</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total Archived Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.source_type === 'waitlist').length}
            </div>
            <div className="text-sm text-gray-600">From Waitlist</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.source_type === 'contact').length}
            </div>
            <div className="text-sm text-gray-600">From Contact Form</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by name, email, phone, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="source-type">Source Type</Label>
              <Select value={sourceTypeFilter} onValueChange={setSourceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                  <SelectItem value="contact">Contact Form</SelectItem>
                  <SelectItem value="former_occupant">Former Occupant</SelectItem>
                  <SelectItem value="general_interest">General Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {users.length === 0 ? 'No archived users found. The database may not be set up yet.' : 'No users match your search criteria.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{user.full_name}</h3>
                        <Badge className={getSourceTypeColor(user.source_type)}>
                          {user.source_type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {user.email}
                        </div>
                        {user.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {user.phone}
                          </div>
                        )}
                        {user.boat_length && (
                          <div>
                            <span className="font-medium">Boat Length:</span> {user.boat_length} ft
                          </div>
                        )}
                        {user.slip_number && (
                          <div>
                            <span className="font-medium">Slip:</span> {user.slip_number}
                          </div>
                        )}
                      </div>
                      {user.message && (
                        <div className="mt-2">
                          <span className="font-medium">Message:</span>
                          <p className="text-gray-600 mt-1">{user.message}</p>
                        </div>
                      )}
                      {user.notes && (
                        <div className="mt-2">
                          <span className="font-medium">Notes:</span>
                          <p className="text-gray-600 mt-1">{user.notes}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                        <span>Archived: {new Date(user.archived_at).toLocaleDateString()}</span>
                        {user.tags && user.tags.length > 0 && (
                          <span>Tags: {user.tags.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
