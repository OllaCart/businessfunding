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
import Image from "next/image"
import { ShareButton } from "@/components/share-button"

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
    
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("title, excerpt, meta_title, meta_description, featured_image_url")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single()

    if (postError) {
      console.error("Error fetching post for metadata:", postError)
      return {
        title: "Post Not Found",
        description: "The requested post could not be found."
      }
    }

    if (!post) {
      console.log("Post not found for metadata generation:", params.slug)
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
    // Return a safe fallback
    return {
      title: "Post Not Found",
      description: "The requested post could not be found."
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
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

    if (postError || !postData) {
      notFound()
    }

    // At this point, postData is guaranteed to exist
    const post = postData

    // Get related posts based on tags only if post exists and has tags
    let relatedPosts = null
    if (post.tags && post.tags.length > 0) {
      try {
        // Add timeout to prevent hanging queries
        const relatedPostsPromise = supabase
          .from("posts")
          .select("id, title, slug, excerpt, featured_image_url, created_at, tags")
          .neq("id", post.id)
          .eq("is_published", true)
          .overlaps("tags", post.tags)
          .order("created_at", { ascending: false })
          .limit(3)

        // Add 5 second timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Related posts query timeout')), 5000)
        )

        const { data: relatedData } = await Promise.race([
          relatedPostsPromise,
          timeoutPromise
        ]) as any

        relatedPosts = relatedData
      } catch (relatedError) {
        // Don't fail the main post if related posts fail
        relatedPosts = null
      }
    }

    // At this point, post is guaranteed to exist
    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        return "Unknown Date"
      }
    }

    const formatContent = (content: string) => {
      try {
        // Simple content formatting - in a real app you might use a markdown parser
        return content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))
      } catch {
        return <p className="mb-4 leading-relaxed">{content}</p>
      }
    }

    const calculateReadingTime = (content: string) => {
      try {
        const wordsPerMinute = 200
        const words = content.trim().split(/\s+/).length
        return Math.ceil(words / wordsPerMinute)
      } catch {
        return 1
      }
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
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  priority
                  onError={(e) => {
                    console.error("Failed to load featured image:", post.featured_image_url)
                    // Hide the image container if it fails to load
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.style.display = 'none'
                    }
                  }}
                />
              </div>
            )}

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{post.created_at ? formatDate(post.created_at) : "Unknown Date"}</span>
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
              {post.updated_at && post.created_at && post.updated_at !== post.created_at && (
                <div className="text-xs">Updated {formatDate(post.updated_at)}</div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              {post.title || "Untitled Post"}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string, index: number) => (
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
              <div className="text-foreground leading-relaxed">
                {post.content ? formatContent(post.content) : "No content available"}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Share this update:</span>
                </div>
                <div className="flex gap-2">
                  <ShareButton 
                    title={post.title || "Marina Update"} 
                    excerpt={post.excerpt || post.title || "Marina Update"}
                  />
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
                {relatedPosts.map((relatedPost: any) => (
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
                          {relatedPost.tags.slice(0, 2).map((tag: string, index: number) => (
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
  } catch (error) {
    console.error("PostPage: Unexpected error:", error)
    notFound()
  }
}
