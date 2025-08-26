import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Mail, Phone, Anchor } from "lucide-react"

export default async function AdminWaitlistPage() {
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

  // Fetch all waitlist entries
  const { data: waitlist } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "converted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSlipTypeLabel = (type: string) => {
    switch (type) {
      case "premium":
        return "Premium"
      case "covered":
        return "Covered"
      case "uncovered":
        return "Open"
      case "any":
        return "Any Available"
      default:
        return type
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif font-bold text-3xl text-foreground">Waitlist Management</h1>
        <p className="text-muted-foreground">Manage customers waiting for dock slip availability</p>
      </div>

      {waitlist && waitlist.length > 0 ? (
        <div className="space-y-4">
          {waitlist.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.full_name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{entry.email}</span>
                      </div>
                      {entry.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{entry.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {entry.boat_length && (
                    <div className="flex items-center space-x-2">
                      <Anchor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Boat: {entry.boat_length} ft</span>
                    </div>
                  )}
                  {entry.preferred_slip_type && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Prefers: {getSlipTypeLabel(entry.preferred_slip_type)}</span>
                    </div>
                  )}
                </div>
                {entry.message && (
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm leading-relaxed">{entry.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Waitlist Entries</h3>
            <p className="text-muted-foreground">
              Customers who join the waitlist will appear here for you to manage and contact.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
