-- EMERGENCY RLS DISABLE AND RESTORE
-- This script temporarily disables RLS to restore functionality, then re-enables with working policies

-- WARNING: This temporarily disables security to restore access
-- We will re-enable it immediately with working policies

SELECT '=== EMERGENCY RLS DISABLE ===' as info;

-- 1. TEMPORARILY DISABLE RLS ON ALL TABLES
SELECT 'Disabling RLS temporarily...' as status;

ALTER TABLE public.dock_slips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;

SELECT 'RLS temporarily disabled on all tables' as status;

-- 2. TEST DATA ACCESS (should work now)
SELECT '=== TESTING DATA ACCESS ===' as info;

SELECT 
    'dock_slips accessible:' as test,
    COUNT(*) as record_count
FROM public.dock_slips;

SELECT 
    'posts accessible:' as test,
    COUNT(*) as record_count
FROM public.posts;

SELECT 
    'admin_profiles accessible:' as test,
    COUNT(*) as record_count
FROM public.admin_profiles;

-- 3. NOW RE-ENABLE RLS WITH WORKING POLICIES
SELECT '=== RE-ENABLING RLS WITH WORKING POLICIES ===' as info;

-- Re-enable RLS
ALTER TABLE public.dock_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 4. CREATE SIMPLE, WORKING POLICIES
SELECT 'Creating simple, working RLS policies...' as status;

-- DOCK_SLIPS: Allow public read, admin full access
DROP POLICY IF EXISTS "dock_slips_select_all" ON public.dock_slips;
DROP POLICY IF EXISTS "dock_slips_admin_manage" ON public.dock_slips;

CREATE POLICY "dock_slips_public_read" ON public.dock_slips
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "dock_slips_admin_full" ON public.dock_slips
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- POSTS: Allow public read of published, admin full access
DROP POLICY IF EXISTS "posts_select_published" ON public.posts;
DROP POLICY IF EXISTS "posts_admin_manage" ON public.posts;

CREATE POLICY "posts_public_read" ON public.posts
    FOR SELECT TO PUBLIC USING (is_published = true);

CREATE POLICY "posts_admin_full" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- ADMIN_PROFILES: Simple, working policies
DROP POLICY IF EXISTS "admin_profiles_select_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_creation" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_view_all" ON public.admin_profiles;

-- Allow users to see their own profile (for login)
CREATE POLICY "admin_profiles_own_profile" ON public.admin_profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "admin_profiles_own_insert" ON public.admin_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "admin_profiles_own_update" ON public.admin_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to see all profiles (for admin management)
CREATE POLICY "admin_profiles_admin_view" ON public.admin_profiles
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

-- CONTACT_SUBMISSIONS: Allow public insert, admin full access
DROP POLICY IF EXISTS "contact_insert_public" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_admin_all" ON public.contact_submissions;

CREATE POLICY "contact_public_insert" ON public.contact_submissions
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "contact_admin_full" ON public.contact_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- WAITLIST: Allow public insert, admin full access
DROP POLICY IF EXISTS "waitlist_insert_public" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_admin_all" ON public.waitlist;

CREATE POLICY "waitlist_public_insert" ON public.waitlist
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "waitlist_admin_full" ON public.waitlist
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- 5. TEST THE NEW POLICIES
SELECT '=== TESTING NEW POLICIES ===' as info;

-- Test dock_slips access
SELECT 
    'dock_slips with new policies:' as test,
    COUNT(*) as accessible_count
FROM public.dock_slips;

-- Test posts access
SELECT 
    'posts with new policies:' as test,
    COUNT(*) as accessible_count
FROM public.posts;

-- Test admin_profiles access (should work for authenticated users)
SELECT 
    'admin_profiles accessible:' as test,
    COUNT(*) as accessible_count
FROM public.admin_profiles;

-- 6. FINAL STATUS
SELECT '=== EMERGENCY RLS RESTORE COMPLETED ===' as status;

-- Show final policy summary
SELECT 
    'Final working RLS policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'admin_profiles', 'contact_submissions', 'waitlist')
ORDER BY tablename, policyname;

SELECT 'Your marina website should now be accessible again!' as success_message;
