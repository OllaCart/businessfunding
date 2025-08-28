-- RESTORE ORIGINAL WORKING STATE
-- This script reverts to the simple, working RLS policies that existed before admin creation features

SELECT '=== RESTORING ORIGINAL WORKING STATE ===' as info;

-- 1. FIRST, DISABLE RLS TO CLEAN SLATE
SELECT 'Disabling RLS to start fresh...' as status;

ALTER TABLE public.dock_slips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES
SELECT 'Dropping all existing policies...' as status;

-- Drop all policies from all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('dock_slips', 'posts', 'admin_profiles', 'contact_submissions', 'waitlist')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 3. RE-ENABLE RLS
SELECT 'Re-enabling RLS...' as status;

ALTER TABLE public.dock_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 4. CREATE ORIGINAL SIMPLE POLICIES
SELECT 'Creating original simple policies...' as status;

-- DOCK_SLIPS: Simple public read, admin full access
CREATE POLICY "dock_slips_select_all" ON public.dock_slips
    FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "dock_slips_admin_all" ON public.dock_slips
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- POSTS: Simple public read of published, admin full access
CREATE POLICY "posts_select_published" ON public.posts
    FOR SELECT TO PUBLIC USING (is_published = true);

CREATE POLICY "posts_admin_all" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- ADMIN_PROFILES: Simple own profile access (for login)
CREATE POLICY "admin_profiles_select_own" ON public.admin_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "admin_profiles_insert_own" ON public.admin_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_profiles_update_own" ON public.admin_profiles
    FOR UPDATE USING (auth.uid() = id);

-- CONTACT_SUBMISSIONS: Simple public insert, admin full access
CREATE POLICY "contact_insert_public" ON public.contact_submissions
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "contact_admin_all" ON public.contact_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- WAITLIST: Simple public insert, admin full access
CREATE POLICY "waitlist_insert_public" ON public.waitlist
    FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "waitlist_admin_all" ON public.waitlist
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid()
        )
    );

-- 5. TEST THE RESTORED POLICIES
SELECT '=== TESTING RESTORED POLICIES ===' as info;

-- Test dock_slips access
SELECT 
    'dock_slips accessible:' as test,
    COUNT(*) as accessible_count
FROM public.dock_slips;

-- Test posts access
SELECT 
    'posts accessible:' as test,
    COUNT(*) as accessible_count
FROM public.posts;

-- Test admin_profiles access
SELECT 
    'admin_profiles accessible:' as test,
    COUNT(*) as accessible_count
FROM public.admin_profiles;

-- 6. FINAL STATUS
SELECT '=== ORIGINAL WORKING STATE RESTORED ===' as status;

-- Show final policy summary
SELECT 
    'Restored RLS policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'admin_profiles', 'contact_submissions', 'waitlist')
ORDER BY tablename, policyname;

SELECT 'Your marina website is now restored to its original working state!' as success_message;
SELECT 'No more admin creation features - just simple, working functionality.' as note;
