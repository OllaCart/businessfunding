-- Fix waitlist table schema to support multiple slip selection and new features
-- First, let's check what columns currently exist
DO $$
BEGIN
    RAISE NOTICE 'Current waitlist table columns:';
    RAISE NOTICE 'Column: %', string_agg(column_name, ', ' ORDER BY ordinal_position)
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'waitlist';
END $$;

-- Add missing columns if they don't exist
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS selected_slips TEXT[] DEFAULT '{}';

ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS priority_order INTEGER;

-- Update existing entries to have default values
UPDATE public.waitlist 
SET selected_slips = '{}' 
WHERE selected_slips IS NULL;

UPDATE public.waitlist 
SET status = 'pending' 
WHERE status IS NULL;

-- Create index for better performance on selected_slips
CREATE INDEX IF NOT EXISTS idx_waitlist_selected_slips ON public.waitlist USING GIN (selected_slips);

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist (status);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waitlist TO authenticated;

-- Verify the final schema
SELECT 
    'Final waitlist schema:' as info,
    string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'waitlist';

-- Show sample data to verify
SELECT 
    'Sample waitlist data:' as info,
    COUNT(*) as total_entries,
    COUNT(CASE WHEN selected_slips IS NOT NULL THEN 1 END) as entries_with_slips,
    COUNT(CASE WHEN status IS NOT NULL THEN 1 END) as entries_with_status
FROM public.waitlist;
