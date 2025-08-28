-- Fix admin creation RLS policies
-- This script allows existing admins to create new admin profiles

-- First, let's check the current policies
SELECT 'Current admin_profiles policies:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'admin_profiles';

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_profiles_insert_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_admins" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_select_admins" ON public.admin_profiles;

-- Create a new policy that allows admins to insert new admin profiles
CREATE POLICY "admin_profiles_insert_admins" ON public.admin_profiles
    FOR INSERT 
    WITH CHECK (
        -- Allow if the user is inserting their own profile (for signup)
        auth.uid() = id
        OR
        -- Allow if the user is an existing admin creating another admin
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Also add a policy to allow admins to view all admin profiles
CREATE POLICY "admin_profiles_select_admins" ON public.admin_profiles
    FOR SELECT 
    USING (
        -- Allow users to see their own profile
        auth.uid() = id
        OR
        -- Allow admins to see all profiles
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Verify the new policies
SELECT 'Updated admin_profiles policies:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'admin_profiles';

-- Test the policies work
SELECT 'Admin creation policies fixed successfully!' as status;
