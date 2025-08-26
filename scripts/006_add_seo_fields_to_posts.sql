-- Add SEO fields to posts table for Google My Business optimization
-- This script adds meta title, meta description, slug, and other SEO fields

-- Add new SEO columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);

-- Create index on tags for better search performance
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

-- Update existing posts to have basic slugs (if any exist)
UPDATE public.posts 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'))
WHERE slug IS NULL;

-- Replace spaces with hyphens in slugs
UPDATE public.posts 
SET slug = REGEXP_REPLACE(slug, '\s+', '-', 'g')
WHERE slug LIKE '% %';

-- Add function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, existing_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate base slug from title
    base_slug := LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
    
    final_slug := base_slug;
    
    -- Check if slug exists and generate unique one
    WHILE EXISTS (
        SELECT 1 FROM public.posts 
        WHERE slug = final_slug 
        AND (existing_id IS NULL OR id != existing_id)
    ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically generate slug when title changes
CREATE OR REPLACE FUNCTION update_post_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update slug if title changed and slug is empty or auto-generated
    IF NEW.title != OLD.title AND (NEW.slug IS NULL OR NEW.slug = OLD.slug) THEN
        NEW.slug := generate_unique_slug(NEW.title, NEW.id);
    END IF;
    
    -- Update reading time based on content length (rough estimate: 200 words per minute)
    IF NEW.content IS NOT NULL THEN
        NEW.reading_time := GREATEST(1, LENGTH(NEW.content) / 1000);
    END IF;
    
    -- Update timestamp
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for posts table
DROP TRIGGER IF EXISTS trigger_update_post_slug ON public.posts;
CREATE TRIGGER trigger_update_post_slug
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_slug();

-- Create trigger for new posts
CREATE OR REPLACE FUNCTION insert_post_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate slug if not provided
    IF NEW.slug IS NULL THEN
        NEW.slug := generate_unique_slug(NEW.title);
    END IF;
    
    -- Calculate reading time
    IF NEW.content IS NOT NULL THEN
        NEW.reading_time := GREATEST(1, LENGTH(NEW.content) / 1000);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new posts
DROP TRIGGER IF EXISTS trigger_insert_post_slug ON public.posts;
CREATE TRIGGER trigger_insert_post_slug
    BEFORE INSERT ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION insert_post_slug();

-- Add comments for documentation
COMMENT ON COLUMN public.posts.meta_title IS 'SEO meta title for search engines and social media';
COMMENT ON COLUMN public.posts.meta_description IS 'SEO meta description for search engines';
COMMENT ON COLUMN public.posts.slug IS 'URL-friendly slug for the post';
COMMENT ON COLUMN public.posts.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN public.posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN public.posts.canonical_url IS 'Canonical URL to prevent duplicate content issues';
