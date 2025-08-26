-- Remove slip_type column from dock_slips table
-- This script updates the database to use availability instead of slip types

-- Remove the slip_type column
ALTER TABLE public.dock_slips DROP COLUMN IF EXISTS slip_type;

-- Update any existing data that might reference slip_type
-- (This is a safety measure in case there are any remaining references)

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'dock_slips' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show current table structure
\d public.dock_slips
