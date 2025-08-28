-- Fix contact_submissions table schema
-- This script ensures the table has the correct columns

-- First, let's check what columns currently exist
-- Run this in your Supabase SQL editor to see the current schema:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'contact_submissions';

-- If the table has the wrong schema, drop and recreate it:
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

-- Create the correct contact_submissions table
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

-- Verify the table was created correctly
-- SELECT * FROM public.contact_submissions LIMIT 0;
