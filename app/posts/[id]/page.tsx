import { createClient } from "@/lib/supabase/server"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

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

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      admin_profiles (
        full_name,
        email
      )
    `)
    .eq("id", params.id)
    .eq("is_published", true)
    .single()

  if (error || !post) {
    notFound()
  }

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title, excerpt, created_at")
    .eq("is_published", true)
    .neq("id", params.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatContent = (content: string) => {
    // Simple content formatting - in a real app you might use a markdown parser
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />

      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Updates
              </Link>
            </Button>
          </div>

          {/* Post Header */}
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image_url || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
              </div>
            )}

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              {post.admin_profiles && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By {post.admin_profiles.full_name || "Marina Staff"}</span>
                </div>
              )}
              {post.updated_at !== post.created_at && (
                <div className="text-xs">Updated {formatDate(post.updated_at)}</div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-muted-foreground text-lg leading-relaxed">{formatContent(post.content)}</div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-foreground mb-8">Related Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-xs text-muted-foreground mb-2">{formatDate(relatedPost.created_at)}</div>
                      <h3 className="font-serif font-semibold text-lg mb-3 leading-tight">
                        <Link href={`/posts/${relatedPost.id}`} className="hover:text-primary transition-colors">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {relatedPost.excerpt.length > 100
                            ? `${relatedPost.excerpt.substring(0, 100)}...`
                            : relatedPost.excerpt}
                        </p>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/posts/${relatedPost.id}`}>Read More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-6">Questions About This Update?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Our marina team is here to help. Contact us for more information or to discuss how this affects your slip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
              <Link href="/contact">Contact Marina Office</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href="/slips">View Available Slips</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarinaFooter />
    </div>
  )
}
