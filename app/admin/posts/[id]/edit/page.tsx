"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, EyeOff, Tag, Link as LinkIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  slug: string | null
  tags: string[] | null
  canonical_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<Post>({
    id: "",
    title: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    tags: [],
    canonical_url: "",
    is_published: false,
    created_at: "",
    updated_at: ""
  })

  const [tagInput, setTagInput] = useState("")
  const [originalData, setOriginalData] = useState<Post | null>(null)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    if (!params.id) return
    
    try {
      const supabase = createClient()
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) throw error

      setFormData({
        ...post,
        tags: post.tags || []
      })
      setOriginalData(post)
    } catch (error) {
      console.error("Error fetching post:", error)
      toast({
        title: "Error",
        description: "Failed to fetch post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    
    setFormData(prev => ({ ...prev, slug }))
  }

  const generateMetaDescription = () => {
    if (formData.excerpt) {
      const metaDesc = formData.excerpt.length > 160 
        ? formData.excerpt.substring(0, 157) + "..."
        : formData.excerpt
      setFormData(prev => ({ ...prev, meta_description: metaDesc }))
    }
  }

  const hasChanges = () => {
    if (!originalData) return false
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image_url: formData.featured_image_url,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          slug: formData.slug,
          tags: formData.tags?.length ? formData.tags : null,
          canonical_url: formData.canonical_url,
          is_published: formData.is_published,
          updated_at: new Date().toISOString()
        })
        .eq("id", formData.id)

      if (error) throw error

      toast({
        title: "Success!",
        description: `Post "${formData.title}" has been updated successfully.`,
      })

      router.push("/admin/posts")
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading post...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Link>
        </Button>
        <div>
          <h1 className="font-serif font-bold text-3xl text-foreground">Edit Post</h1>
          <p className="text-muted-foreground">Update marina update with SEO optimization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter post title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt || ""}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                placeholder="Brief summary of the post..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image_url">Featured Image URL</Label>
              <Input
                id="featured_image_url"
                value={formData.featured_image_url || ""}
                onChange={(e) => handleInputChange("featured_image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug || ""}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="auto-generated-slug"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateSlug}
                    disabled={!formData.title}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={formData.canonical_url || ""}
                  onChange={(e) => handleInputChange("canonical_url", e.target.value)}
                  placeholder="https://example.com/canonical-url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title || ""}
                onChange={(e) => handleInputChange("meta_title", e.target.value)}
                placeholder="SEO title for search engines (leave empty to use post title)"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                {(formData.meta_title || "").length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ""}
                onChange={(e) => handleInputChange("meta_description", e.target.value)}
                placeholder="SEO description for search engines (leave empty to use excerpt)"
                rows={3}
                maxLength={160}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {(formData.meta_description || "").length}/160 characters
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generateMetaDescription}
                  disabled={!formData.excerpt}
                >
                  Generate from Excerpt
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter..."
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Publishing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="is_published">Publish immediately</Label>
                <p className="text-sm text-muted-foreground">
                  Make this post visible to visitors
                </p>
              </div>
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => handleInputChange("is_published", checked)}
              />
            </div>

            {formData.is_published && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">This post is published</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Visitors can see this post on the public blog.
                </p>
              </div>
            )}

            {!formData.is_published && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <EyeOff className="h-4 w-4" />
                  <span className="font-medium">This post is a draft</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Only you can see this post. Publish it to make it visible to visitors.
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(formData.created_at).toLocaleDateString()}</p>
              <p>Last updated: {new Date(formData.updated_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/posts")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !hasChanges()}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-4">{formData.title || "Post Title"}</h1>
              {formData.excerpt && (
                <p className="text-lg text-muted-foreground mb-6 italic">{formData.excerpt}</p>
              )}
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
              <div className="whitespace-pre-wrap">{formData.content || "Post content will appear here..."}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
