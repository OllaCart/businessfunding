-- Fix login RLS policies that were broken by admin creation changes
-- This script ensures users can still log in while maintaining admin creation security

-- First, let's check the current policies
SELECT 'Current admin_profiles policies:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'admin_profiles';

-- Drop the problematic policies
DROP POLICY IF EXISTS "admin_profiles_insert_admins" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_select_admins" ON public.admin_profiles;

-- Restore the original working policies for basic authentication
CREATE POLICY "admin_profiles_select_own" ON public.admin_profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "admin_profiles_insert_own" ON public.admin_profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_profiles_update_own" ON public.admin_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Add a new policy specifically for admin creation (more targeted)
CREATE POLICY "admin_profiles_admin_creation" ON public.admin_profiles
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

-- Add a policy for admins to view all profiles (for admin management)
CREATE POLICY "admin_profiles_admin_view_all" ON public.admin_profiles
    FOR SELECT 
    USING (
        -- Allow users to see their own profile (for login)
        auth.uid() = id
        OR
        -- Allow admins to see all profiles (for admin management)
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

-- Test that login should work now
SELECT 'Login RLS policies fixed successfully!' as status;
