import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar user={user} adminProfile={adminProfile} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
