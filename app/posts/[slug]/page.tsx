import { createClient } from "@/lib/supabase/server"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Tag, Clock, Share2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

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
  meta_title: string | null
  meta_description: string | null
  slug: string | null
  tags: string[] | null
  reading_time: number | null
  admin_profiles: {
    full_name: string | null
    email: string
  } | null
}

interface PostPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const supabase = await createClient()
    
    const { data: post } = await supabase
      .from("posts")
      .select("title, excerpt, meta_title, meta_description, featured_image_url")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single()

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found."
      }
    }

    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt || "Marina update and news from Marina By-The-Sea."

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: post.featured_image_url ? [post.featured_image_url] : [],
        publishedTime: new Date().toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.featured_image_url ? [post.featured_image_url] : [],
      },
    }
  } catch (err) {
    console.error("Error generating metadata:", err)
    return {
      title: "Post Not Found",
      description: "The requested post could not be found."
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post = null
  let relatedPosts = null
  let error = null

  try {
    const supabase = await createClient()

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        admin_profiles (
          full_name,
          email
        )
      `)
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single()

    if (postError) {
      error = postError
    } else if (postData) {
      post = postData

      // Get related posts based on tags only if post exists and has tags
      if (post.tags && post.tags.length > 0) {
        try {
          const { data: relatedData } = await supabase
            .from("posts")
            .select("id, title, slug, excerpt, featured_image_url, created_at")
            .neq("id", post.id)
            .eq("is_published", true)
            .overlaps("tags", post.tags)
            .order("created_at", { ascending: false })
            .limit(3)

          relatedPosts = relatedData
        } catch (relatedError) {
          console.error("Error fetching related posts:", relatedError)
          // Don't fail the main post if related posts fail
        }
      }
    }
  } catch (err) {
    console.error("Error creating Supabase client:", err)
    error = err
  }

  // Check for errors or missing post early
  if (error || !post) {
    console.error("Post not found or error occurred:", { error, post: !!post, slug: params.slug })
    notFound()
  }

  // At this point, post is guaranteed to exist
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

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const readingTime = post.reading_time || calculateReadingTime(post.content)

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
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={post.featured_image_url}
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
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              {post.updated_at !== post.created_at && (
                <div className="text-xs">Updated {formatDate(post.updated_at)}</div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-8 p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed">{formatContent(post.content)}</div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Share this update:</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt || post.title,
                          url: window.location.href,
                        })
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
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
                        <Link href={`/posts/${relatedPost.slug || relatedPost.id}`} className="hover:text-primary transition-colors">
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
                      {relatedPost.tags && relatedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {relatedPost.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/posts/${relatedPost.slug || relatedPost.id}`}>Read More</Link>
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
