import { createClient } from "@/lib/supabase/server"
import { BusinessHeader } from "@/components/business-header"
import { BusinessFooter } from "@/components/business-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

// Force dynamic rendering to prevent static generation issues with Supabase server client
export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  author_id: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  admin_profiles: {
    full_name: string | null
    email: string
  } | null
}

export default async function PostsPage() {
  let posts = null
  let error = null

  try {
    const supabase = await createClient()

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(`
        *,
        admin_profiles (
          full_name,
          email
        )
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    posts = postsData
    error = postsError
  } catch (err) {
    console.error("Error creating Supabase client:", err)
    error = err
  }

  if (error) {
    console.error("Error fetching posts:", error)
    // Don't fail the page, just show no posts
  }

  // Log the state for debugging
  console.log("Posts page state:", { 
    postsCount: posts?.length || 0, 
    hasError: !!error, 
    errorMessage: error instanceof Error ? error.message : String(error)
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getExcerpt = (post: Post) => {
    if (post.excerpt) return post.excerpt
    // Create excerpt from content if none exists
    const plainText = post.content.replace(/<[^>]*>/g, "")
    return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText
  }

  return (
    <div className="min-h-screen bg-background">
      <BusinessHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
              Notes
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Occasional notes on business funding. The standing explanations live in the guides, which do not depend on
              this list.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {posts[0] && (
                <div className="mb-16">
                  <Badge className="mb-4 bg-secondary text-secondary-foreground">Featured</Badge>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-primary/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="h-64 lg:h-auto bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                        {posts[0].featured_image_url ? (
                          <img
                            src={posts[0].featured_image_url}
                            alt={posts[0].title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground">Featured Update</p>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(posts[0].created_at)}</span>
                          </div>
                          {posts[0].admin_profiles && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{posts[0].admin_profiles.full_name || "Sure Thing Lending"}</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="font-serif text-2xl lg:text-3xl mb-4">{posts[0].title}</CardTitle>
                        {posts[0].tags && posts[0].tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {posts[0].tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-muted-foreground mb-6 leading-relaxed">{getExcerpt(posts[0])}</p>
                        <Button asChild className="w-fit bg-primary hover:bg-primary/90">
                          <Link href={`/posts/${posts[0].slug || posts[0].id}`}>
                            Read Full Update
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              )}

              {/* Recent Posts Grid */}
              {posts.length > 1 && (
                <div>
                  <h2 className="font-serif font-bold text-3xl text-foreground mb-8">Recent Updates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.slice(1).map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
                          {post.featured_image_url ? (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Calendar className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-sm text-muted-foreground">Note</p>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            {post.admin_profiles && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{post.admin_profiles.full_name || "Staff"}</span>
                              </div>
                            )}
                          </div>
                          <CardTitle className="font-serif text-lg leading-tight">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{getExcerpt(post)}</p>
                          <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                            <Link href={`/posts/${post.slug || post.id}`}>Read More</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Updates Yet</h3>
                <p className="text-muted-foreground mb-6">
                  {posts === null 
                    ? "Unable to load posts at this time. Please try again later."
                    : "No notes are published yet. The funding guides are the place to start."
                  }
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/guides">Read the guides</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Start with a guide</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The guides explain working capital, equipment, and property loans without a rate sheet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/guides">Read the guides</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Ask which path fits</Link>
            </Button>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  )
}
