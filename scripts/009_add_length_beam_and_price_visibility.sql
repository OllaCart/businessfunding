-- Add length_capacity, beam_capacity, and show_price fields to dock_slips table
-- This script updates the database to support separate length/beam dimensions and price visibility

-- Add new columns
ALTER TABLE public.dock_slips 
ADD COLUMN IF NOT EXISTS length_capacity INTEGER,
ADD COLUMN IF NOT EXISTS beam_capacity INTEGER,
ADD COLUMN IF NOT EXISTS show_price BOOLEAN DEFAULT true;

-- Update existing records to set length_capacity from the old capacity field
UPDATE public.dock_slips 
SET length_capacity = capacity 
WHERE length_capacity IS NULL AND capacity IS NOT NULL;

-- Set default beam_capacity for existing records (assuming 1/3 of length as a reasonable default)
UPDATE public.dock_slips 
SET beam_capacity = GREATEST(8, LEAST(length_capacity / 3, 20))
WHERE beam_capacity IS NULL AND length_capacity IS NOT NULL;

-- Set show_price to true for existing records
UPDATE public.dock_slips 
SET show_price = true 
WHERE show_price IS NULL;

-- Make the new fields required (after setting defaults)
ALTER TABLE public.dock_slips 
ALTER COLUMN length_capacity SET NOT NULL,
ALTER COLUMN beam_capacity SET NOT NULL,
ALTER COLUMN show_price SET NOT NULL;

-- Drop the old capacity column
ALTER TABLE public.dock_slips DROP COLUMN IF EXISTS capacity;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dock_slips_length_capacity ON public.dock_slips(length_capacity);
CREATE INDEX IF NOT EXISTS idx_dock_slips_beam_capacity ON public.dock_slips(beam_capacity);
CREATE INDEX IF NOT EXISTS idx_dock_slips_show_price ON public.dock_slips(show_price);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'dock_slips' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data
SELECT slip_number, length_capacity, beam_capacity, monthly_rate, show_price, is_available
FROM public.dock_slips 
LIMIT 5;
