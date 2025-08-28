import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Eye, Calendar, User } from "lucide-react"

// Force dynamic rendering to prevent static generation issues with Supabase server client and auth
export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
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

  // Fetch all posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      admin_profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">Posts Management</h1>
          <p className="text-muted-foreground">Create and manage marina updates and announcements</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-serif font-semibold text-lg">{post.title}</h3>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Published" : "Draft"}
                      </Badge>
                      {post.slug && (
                        <Badge variant="outline" className="text-xs">
                          /{post.slug}
                        </Badge>
                      )}
                    </div>

                    {post.excerpt && <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>}

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      {post.admin_profiles && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.admin_profiles.full_name || "Admin"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {post.is_published && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/posts/${post.slug || post.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first marina update to keep visitors informed about news and events.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/posts/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
