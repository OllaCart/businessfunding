-- FIX ADMIN_PROFILES RLS POLICIES
-- This script fixes the RLS policies that are preventing admin profile creation during setup

SELECT '=== FIXING ADMIN_PROFILES RLS POLICIES ===' as info;

-- 1. Check current policies
SELECT 'Current admin_profiles policies:' as info;
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'admin_profiles';

-- 2. Drop existing restrictive policies
SELECT 'Dropping restrictive policies...' as status;

DROP POLICY IF EXISTS "admin_profiles_select_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_creation" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_view_all" ON public.admin_profiles;

-- 3. Create working policies for admin setup process
SELECT 'Creating working RLS policies...' as status;

-- Allow users to see their own profile (for login)
CREATE POLICY "admin_profiles_select_own" ON public.admin_profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup/setup)
CREATE POLICY "admin_profiles_insert_own" ON public.admin_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "admin_profiles_update_own" ON public.admin_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to see all profiles (for admin management)
CREATE POLICY "admin_profiles_admin_view_all" ON public.admin_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Allow admins to create new admin profiles
CREATE POLICY "admin_profiles_admin_create" ON public.admin_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- 4. Test the policies
SELECT '=== TESTING RLS POLICIES ===' as info;

-- Check that policies are created
SELECT 
    'Updated admin_profiles policies:' as info,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'admin_profiles'
ORDER BY policyname;

-- 5. Verify admin_profiles table structure
SELECT '=== VERIFYING TABLE STRUCTURE ===' as info;

SELECT 
    'admin_profiles columns:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'admin_profiles'
ORDER BY ordinal_position;

-- 6. Final status
SELECT '=== ADMIN_PROFILES RLS FIXED ===' as status;
SELECT 'Admin setup process should now work properly!' as success_message;
