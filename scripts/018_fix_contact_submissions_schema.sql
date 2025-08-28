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

-- Verify the table was created correctly
-- SELECT * FROM public.contact_submissions LIMIT 0;
