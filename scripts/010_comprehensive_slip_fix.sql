-- Comprehensive fix for slip management and post editing
-- This script ensures all necessary fields exist and data is properly migrated

-- 1. Fix dock_slips table structure
-- Add new columns if they don't exist
ALTER TABLE public.dock_slips 
ADD COLUMN IF NOT EXISTS length_capacity INTEGER,
ADD COLUMN IF NOT EXISTS beam_capacity INTEGER,
ADD COLUMN IF NOT EXISTS show_price BOOLEAN DEFAULT true;

-- 2. Migrate existing data from capacity to length_capacity
UPDATE public.dock_slips 
SET length_capacity = capacity 
WHERE length_capacity IS NULL AND capacity IS NOT NULL;

-- 3. Set default beam_capacity for existing records
UPDATE public.dock_slips 
SET beam_capacity = GREATEST(8, LEAST(COALESCE(length_capacity, 25) / 3, 20))
WHERE beam_capacity IS NULL;

-- 4. Set show_price to true for existing records
UPDATE public.dock_slips 
SET show_price = true 
WHERE show_price IS NULL;

-- 5. Make new fields required (after setting defaults)
ALTER TABLE public.dock_slips 
ALTER COLUMN length_capacity SET NOT NULL,
ALTER COLUMN beam_capacity SET NOT NULL,
ALTER COLUMN show_price SET NOT NULL;

-- 6. Drop old capacity column if it exists
ALTER TABLE public.dock_slips DROP COLUMN IF EXISTS capacity;

-- 7. Ensure posts table has all necessary SEO fields
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dock_slips_length_capacity ON public.dock_slips(length_capacity);
CREATE INDEX IF NOT EXISTS idx_dock_slips_beam_capacity ON public.dock_slips(beam_capacity);
CREATE INDEX IF NOT EXISTS idx_dock_slips_show_price ON public.dock_slips(show_price);
CREATE INDEX IF NOT EXISTS idx_dock_slips_slip_number ON public.dock_slips(slip_number);
CREATE INDEX IF NOT EXISTS idx_dock_slips_is_available ON public.dock_slips(is_available);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts(is_published);

-- 9. Ensure proper RLS policies for posts
DROP POLICY IF EXISTS "posts_admin_all" ON public.posts;
CREATE POLICY "posts_admin_all" ON public.posts 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- 10. Ensure proper RLS policies for dock_slips
DROP POLICY IF EXISTS "dock_slips_admin_all" ON public.dock_slips;
CREATE POLICY "dock_slips_admin_all" ON public.dock_slips 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  )
);

-- 11. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.dock_slips TO anon, authenticated;
GRANT ALL ON public.posts TO anon, authenticated;
GRANT ALL ON public.admin_profiles TO anon, authenticated;

-- 12. Verify table structure
SELECT 'dock_slips' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'dock_slips' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'posts' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 13. Show sample data
SELECT 'Sample dock_slips:' as info;
SELECT slip_number, length_capacity, beam_capacity, monthly_rate, show_price, is_available
FROM public.dock_slips 
LIMIT 5;

SELECT 'Sample posts:' as info;
SELECT title, slug, is_published, created_at
FROM public.posts 
LIMIT 5;
