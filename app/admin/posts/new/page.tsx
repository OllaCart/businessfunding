"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Eye, EyeOff, Tag, Clock, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    tags: [] as string[],
    canonical_url: "",
    is_published: false,
    send_announcement: false,
    announcement_message: ""
  })

  const [tagInput, setTagInput] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      // Prepare insert data with only required fields
      const insertData: any = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || null,
        featured_image_url: formData.featured_image_url || null,
        is_published: formData.is_published,
        author_id: user.id
      }

      // Add SEO fields if they have values
      if (formData.meta_title) insertData.meta_title = formData.meta_title
      if (formData.meta_description) insertData.meta_description = formData.meta_description
      if (formData.slug) insertData.slug = formData.slug
      if (formData.tags.length > 0) insertData.tags = formData.tags
      if (formData.canonical_url) insertData.canonical_url = formData.canonical_url

      const { data: post, error } = await supabase
        .from("posts")
        .insert(insertData)
        .select()
        .single()

      if (error) throw error

      // If announcement is requested, send it
      if (formData.send_announcement && post) {
        try {
          const announcementContent = formData.announcement_message || formData.content.substring(0, 500) + (formData.content.length > 500 ? '...' : '')
          
          const response = await fetch('/api/send-admin-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: 'system@marinabts.com', // This won't actually send to this address
              subject: `Post Announcement: ${formData.title}`,
              content: announcementContent,
              isPostAnnouncement: true,
              postId: post.id,
              postTitle: formData.title,
              postSlug: post.slug || post.id,
              entryId: null,
              slipId: null,
              action: 'post_announcement'
            })
          })

          if (!response.ok) {
            console.warn('Failed to send post announcement, but post was created successfully')
          } else {
            console.log('Post announcement sent successfully')
            toast({
              title: "Announcement Sent!",
              description: `Post announcement has been sent to all slipholders and waitlisted users.`,
            })
          }
        } catch (announcementError) {
          console.error('Error sending post announcement:', announcementError)
          // Don't fail the post creation if announcement fails
        }
      }

      toast({
        title: "Success!",
        description: `Post "${formData.title}" has been ${formData.is_published ? "published" : "saved as draft"}.`,
      })

      router.push("/admin/posts")
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="font-serif font-bold text-3xl text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Create a new marina update with SEO optimization</p>
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
                value={formData.excerpt}
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
                value={formData.featured_image_url}
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
                    value={formData.slug}
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
                  value={formData.canonical_url}
                  onChange={(e) => handleInputChange("canonical_url", e.target.value)}
                  placeholder="https://example.com/canonical-url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => handleInputChange("meta_title", e.target.value)}
                placeholder="SEO title for search engines (leave empty to use post title)"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                {formData.meta_title.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => handleInputChange("meta_description", e.target.value)}
                placeholder="SEO description for search engines (leave empty to use excerpt)"
                rows={3}
                maxLength={160}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {formData.meta_description.length}/160 characters
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
              {formData.tags.length > 0 && (
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
                  <span className="font-medium">This post will be published immediately</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Visitors will be able to see this post on the public blog.
                </p>
              </div>
            )}

            {!formData.is_published && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <EyeOff className="h-4 w-4" />
                  <span className="font-medium">This post will be saved as a draft</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  You can publish it later from the posts management page.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcement Option */}
        <Card>
          <CardHeader>
            <CardTitle>Announcement Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="send_announcement"
                checked={formData.send_announcement}
                onChange={(e) => handleInputChange("send_announcement", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="send_announcement" className="text-base">
                Send announcement to all slipholders and waitlisted users
              </Label>
            </div>
            {formData.send_announcement && (
              <div className="ml-6 space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-800 text-sm">
                    <strong>Announcement will be sent to:</strong>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>All current slipholders</li>
                      <li>All waitlisted users</li>
                      <li>Users will receive a personalized email with a link to this post</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <Label htmlFor="announcement_message">Custom Announcement Message (Optional)</Label>
                  <Textarea
                    id="announcement_message"
                    value={formData.announcement_message}
                    onChange={(e) => handleInputChange("announcement_message", e.target.value)}
                    placeholder="Write a custom message to include with the announcement email..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to use the post content as the announcement
                  </p>
                </div>
              </div>
            )}
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
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {formData.is_published ? "Publish Post" : "Save Draft"}
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
              {formData.tags.length > 0 && (
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
