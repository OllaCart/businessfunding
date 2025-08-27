-- Add missing columns to posts table for full functionality
-- This script adds columns that the frontend expects but are missing from the database

-- Add missing columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS send_announcement BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS announcement_message TEXT;

-- Add any other missing columns that might be needed
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- Verify the table structure
SELECT 'posts' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT 'Sample posts structure:' as info;
SELECT title, slug, is_published, featured_image_url, send_announcement, announcement_message
FROM public.posts 
LIMIT 3;
