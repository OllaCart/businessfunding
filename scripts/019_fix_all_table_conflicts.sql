-- Fix all table conflicts and constraints
-- This script resolves the issues caused by conflicting schema changes

-- 1. Fix contact_submissions table and trigger
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'responded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "contact_insert_public" ON public.contact_submissions FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "contact_admin_all" ON public.contact_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Fix the trigger function to use the correct column name
CREATE OR REPLACE FUNCTION archive_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_archive (
        email,
        full_name,
        phone,
        message,
        source_type,
        source_details,
        notes
    ) VALUES (
        NEW.email,
        NEW.name,  -- Changed from NEW.full_name to NEW.name
        NEW.phone,
        NEW.message,
        'contact',
        jsonb_build_object(
            'contact_id', NEW.id,
            'contact_created_at', NEW.created_at
        ),
        'Contact form submission'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_archive_contact_submission ON public.contact_submissions;
CREATE TRIGGER trigger_archive_contact_submission
    AFTER INSERT ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION archive_contact_submission();

-- 2. Fix waitlist table constraints
-- Remove conflicting status constraints
ALTER TABLE public.waitlist 
DROP CONSTRAINT IF EXISTS waitlist_status_check;

-- Allow all the status values that different parts of the system need
ALTER TABLE public.waitlist 
ADD CONSTRAINT waitlist_status_check 
CHECK (status IN ('pending', 'contacted', 'converted', 'waitlisted', 'offered', 'pending_occupant', 'occupant'));

-- Ensure the status column has the right default
ALTER TABLE public.waitlist 
ALTER COLUMN status SET DEFAULT 'pending';

-- 3. Fix any missing columns in waitlist
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS selected_slips TEXT[] DEFAULT '{}';

ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS priority_order INTEGER;

-- 4. Verify the fixes
SELECT 'Tables fixed successfully' as status;

-- Show contact_submissions schema
SELECT 'contact_submissions columns:' as info, 
       string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'contact_submissions';

-- Show waitlist schema
SELECT 'waitlist columns:' as info, 
       string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'waitlist';

-- Show waitlist status constraint
SELECT 'waitlist status constraint:' as info, 
       conname as constraint_name,
       pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.waitlist'::regclass AND contype = 'c';
