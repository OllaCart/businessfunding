-- Fix RLS policies that are blocking access to existing data
-- This script diagnoses and fixes the data access issues

-- First, let's check what data exists
SELECT '=== DATA DIAGNOSTICS ===' as info;

SELECT 
    'dock_slips data:' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_available = true THEN 1 END) as available_slips,
    COUNT(CASE WHEN is_available = false THEN 1 END) as occupied_slips
FROM public.dock_slips;

SELECT 
    'posts data:' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_posts,
    COUNT(CASE WHEN is_published = false THEN 1 END) as draft_posts
FROM public.posts;

-- Check current RLS policies
SELECT '=== CURRENT RLS POLICIES ===' as info;

SELECT 
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'admin_profiles')
ORDER BY tablename, policyname;

-- Check if RLS is enabled and blocking data
SELECT '=== RLS STATUS ===' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('dock_slips', 'posts', 'admin_profiles')
ORDER BY tablename;

-- Now let's fix the RLS policies to ensure data is accessible

-- 1. Fix dock_slips RLS policies
SELECT '=== FIXING DOCK_SLIPS RLS ===' as info;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "dock_slips_select_all" ON public.dock_slips;
DROP POLICY IF EXISTS "dock_slips_admin_all" ON public.dock_slips;

-- Create proper policies that allow data access
CREATE POLICY "dock_slips_select_all" ON public.dock_slips
    FOR SELECT 
    TO PUBLIC 
    USING (true);  -- Allow everyone to see slips

CREATE POLICY "dock_slips_admin_manage" ON public.dock_slips
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- 2. Fix posts RLS policies
SELECT '=== FIXING POSTS RLS ===' as info;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "posts_select_published" ON public.posts;
DROP POLICY IF EXISTS "posts_admin_all" ON public.posts;

-- Create proper policies that allow data access
CREATE POLICY "posts_select_published" ON public.posts
    FOR SELECT 
    TO PUBLIC 
    USING (is_published = true);  -- Allow public to see published posts

CREATE POLICY "posts_admin_manage" ON public.posts
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- 3. Ensure admin_profiles policies allow proper access
SELECT '=== FIXING ADMIN_PROFILES RLS ===' as info;

-- Drop problematic policies
DROP POLICY IF EXISTS "admin_profiles_select_admins" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_view_all" ON public.admin_profiles;

-- Restore working policies
CREATE POLICY "admin_profiles_select_own" ON public.admin_profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "admin_profiles_insert_own" ON public.admin_profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_profiles_update_own" ON public.admin_profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Add policy for admin creation
CREATE POLICY "admin_profiles_admin_creation" ON public.admin_profiles
    FOR INSERT 
    WITH CHECK (
        auth.uid() = id
        OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Add policy for admins to view all profiles
CREATE POLICY "admin_profiles_admin_view_all" ON public.admin_profiles
    FOR SELECT 
    USING (
        auth.uid() = id
        OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

-- 4. Test data access
SELECT '=== TESTING DATA ACCESS ===' as info;

-- Test dock_slips access
SELECT 
    'dock_slips accessible records:' as test,
    COUNT(*) as accessible_count
FROM public.dock_slips;

-- Test posts access
SELECT 
    'posts accessible records:' as test,
    COUNT(*) as accessible_count
FROM public.posts;

-- Test published posts specifically
SELECT 
    'published posts accessible:' as test,
    COUNT(*) as published_count
FROM public.posts 
WHERE is_published = true;

-- Final status
SELECT '=== RLS FIXES COMPLETED ===' as status;

-- Show final policy summary
SELECT 
    'Final RLS policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'admin_profiles')
ORDER BY tablename, policyname;
