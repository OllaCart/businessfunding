import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, Anchor, FileText, TrendingUp, Clock } from "lucide-react"

// Force dynamic rendering to prevent static generation issues with Supabase server client and auth
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: adminProfile } = await supabase.from("admin_profiles").select("*").eq("id", user.id).single()

  if (!adminProfile) {
    redirect("/auth/login")
  }

  // Fetch dashboard statistics
  const [
    { count: totalSlips },
    { count: availableSlips },
    { count: totalPosts },
    { count: publishedPosts },
    { count: waitlistCount },
    { count: contactCount },
    { data: recentContacts },
    { data: recentWaitlist },
  ] = await Promise.all([
    supabase.from("dock_slips").select("*", { count: "exact", head: true }),
    supabase.from("dock_slips").select("*", { count: "exact", head: true }).eq("is_available", true),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("waitlist").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("waitlist").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  const occupancyRate = totalSlips ? Math.round(((totalSlips - (availableSlips || 0)) / totalSlips) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="font-serif font-bold text-2xl text-foreground">Marina Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {adminProfile.full_name || adminProfile.email}
              </p>
            </div>
            <Badge variant="secondary">Admin</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Slips</CardTitle>
              <Anchor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSlips || 0}</div>
              <p className="text-xs text-muted-foreground">{availableSlips || 0} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">{(totalSlips || 0) - (availableSlips || 0)} occupied</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistCount || 0}</div>
              <p className="text-xs text-muted-foreground">People waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total inquiries</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Posts Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">{totalPosts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="font-semibold">{publishedPosts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Drafts</span>
                  <span className="font-semibold">{(totalPosts || 0) - (publishedPosts || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a
                  href="/admin/posts/new"
                  className="block w-full text-left p-2 rounded hover:bg-muted transition-colors"
                >
                  Create New Post
                </a>
                <a href="/admin/slips" className="block w-full text-left p-2 rounded hover:bg-muted transition-colors">
                  Manage Dock Slips
                </a>
                <a
                  href="/admin/waitlist"
                  className="block w-full text-left p-2 rounded hover:bg-muted transition-colors"
                >
                  View Waitlist
                </a>
                <a
                  href="/admin/contacts"
                  className="block w-full text-left p-2 rounded hover:bg-muted transition-colors"
                >
                  Review Messages
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {recentContacts && recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="border-b border-border pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{contact.name}</span>
                        <Badge variant={contact.status === "new" ? "default" : "secondary"} className="text-xs">
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{contact.email}</p>
                      <p className="text-sm text-foreground line-clamp-2">
                        {contact.message.length > 100 ? `${contact.message.substring(0, 100)}...` : contact.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent messages</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Waitlist Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {recentWaitlist && recentWaitlist.length > 0 ? (
                <div className="space-y-4">
                  {recentWaitlist.map((entry) => (
                    <div key={entry.id} className="border-b border-border pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{entry.full_name}</span>
                        <Badge variant={entry.status === "pending" ? "default" : "secondary"} className="text-xs">
                          {entry.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{entry.email}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {entry.boat_length && <span>{entry.boat_length}ft boat</span>}
                        {entry.preferred_slip_type && <span>• {entry.preferred_slip_type} slip</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent waitlist entries</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
