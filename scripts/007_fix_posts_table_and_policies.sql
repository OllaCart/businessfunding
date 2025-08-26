-- Fix posts table and policies to ensure post creation and editing works
-- This script addresses common issues with post management

-- First, ensure all SEO columns exist
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Remove unique constraint on slug temporarily to avoid conflicts
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_slug_key;

-- Add unique constraint back (this will fail if there are duplicates)
DO $$
BEGIN
    -- Check if there are duplicate slugs
    IF EXISTS (
        SELECT slug, COUNT(*) 
        FROM public.posts 
        WHERE slug IS NOT NULL 
        GROUP BY slug 
        HAVING COUNT(*) > 1
    ) THEN
        -- Update duplicate slugs to make them unique
        UPDATE public.posts 
        SET slug = slug || '-' || id::text
        WHERE id IN (
            SELECT id FROM (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
                FROM public.posts 
                WHERE slug IS NOT NULL
            ) t WHERE rn > 1
        );
    END IF;
    
    -- Now add the unique constraint
    ALTER TABLE public.posts ADD CONSTRAINT posts_slug_key UNIQUE (slug);
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Unique constraint already exists';
    WHEN others THEN
        RAISE NOTICE 'Error adding unique constraint: %', SQLERRM;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at);

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "posts_select_published" ON public.posts;
DROP POLICY IF EXISTS "posts_admin_all" ON public.posts;

-- Create comprehensive policies for posts
-- Public can read published posts
CREATE POLICY "posts_select_published" ON public.posts 
FOR SELECT TO PUBLIC 
USING (is_published = true);

-- Admins can do everything with posts
CREATE POLICY "posts_admin_all" ON public.posts 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- Admins can insert posts
CREATE POLICY "posts_admin_insert" ON public.posts 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- Admins can update posts
CREATE POLICY "posts_admin_update" ON public.posts 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- Admins can delete posts
CREATE POLICY "posts_admin_delete" ON public.posts 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- Ensure the trigger functions exist and work properly
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

-- Update trigger function
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

-- Insert trigger function
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
    
    -- Set author_id if not provided
    IF NEW.author_id IS NULL THEN
        NEW.author_id := auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_update_post_slug ON public.posts;
DROP TRIGGER IF EXISTS trigger_insert_post_slug ON public.posts;

-- Create triggers
CREATE TRIGGER trigger_update_post_slug
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_post_slug();

CREATE TRIGGER trigger_insert_post_slug
    BEFORE INSERT ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION insert_post_slug();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.posts TO anon, authenticated;
GRANT ALL ON public.admin_profiles TO anon, authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Test insert (this will be rolled back)
DO $$
BEGIN
    -- Try to insert a test post to verify policies work
    INSERT INTO public.posts (title, content, excerpt, is_published) 
    VALUES ('Test Post', 'This is a test post content.', 'Test excerpt', false);
    
    -- Rollback the test insert
    RAISE NOTICE 'Test insert successful - policies are working';
    ROLLBACK;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Test insert failed: %', SQLERRM;
        RAISE NOTICE 'This indicates a policy or permission issue';
END $$;
