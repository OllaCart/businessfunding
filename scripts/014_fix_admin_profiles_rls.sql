-- Fix RLS policies for admin_profiles to allow contact submission API to read admin emails
-- This allows the contact form to send notifications to all admins

-- Drop the restrictive select policy
DROP POLICY IF EXISTS "admin_profiles_select_own" ON public.admin_profiles;

-- Create a new policy that allows public read access to admin emails (needed for contact notifications)
CREATE POLICY "admin_profiles_select_public" ON public.admin_profiles 
FOR SELECT TO PUBLIC 
USING (true);

-- Keep the existing insert and update policies for security
-- These policies remain unchanged:
-- "admin_profiles_insert_own" - users can only insert their own profile
-- "admin_profiles_update_own" - users can only update their own profile

-- Verify the change
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'admin_profiles';
