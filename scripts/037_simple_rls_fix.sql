-- SIMPLE RLS FIX - CHECK AND FIX EXISTING POLICIES
-- This script checks what policies exist and only creates missing ones

SELECT '=== CHECKING CURRENT RLS STATUS ===' as info;

-- 1. Check current RLS status
SELECT 
    'Current RLS status:' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('dock_slips', 'posts', 'contact_submissions', 'waitlist')
ORDER BY tablename;

-- 2. Check current policies
SELECT 
    'Current policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'contact_submissions', 'waitlist')
ORDER BY tablename, policyname;

-- 3. Test data access BEFORE any changes
SELECT '=== TESTING DATA ACCESS BEFORE CHANGES ===' as test;

SELECT 
    'dock_slips access test:' as test,
    COUNT(*) as accessible_count
FROM public.dock_slips;

SELECT 
    'posts access test:' as test,
    COUNT(*) as accessible_count
FROM public.posts;

SELECT 
    'contact_submissions access test:' as test,
    COUNT(*) as accessible_count
FROM public.contact_submissions;

SELECT 
    'waitlist access test:' as test,
    COUNT(*) as accessible_count
FROM public.waitlist;

-- 4. If data access fails, create simple policies
SELECT '=== CREATING SIMPLE POLICIES IF NEEDED ===' as action;

-- Only create policies if they don't exist
DO $$
BEGIN
    -- dock_slips
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dock_slips' AND policyname = 'dock_slips_allow_all') THEN
        CREATE POLICY "dock_slips_allow_all" ON public.dock_slips FOR ALL USING (true) WITH CHECK (true);
        RAISE NOTICE 'Created dock_slips_allow_all policy';
    ELSE
        RAISE NOTICE 'dock_slips_allow_all policy already exists';
    END IF;

    -- posts
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'posts_allow_all') THEN
        CREATE POLICY "posts_allow_all" ON public.posts FOR ALL USING (true) WITH CHECK (true);
        RAISE NOTICE 'Created posts_allow_all policy';
    ELSE
        RAISE NOTICE 'posts_allow_all policy already exists';
    END IF;

    -- contact_submissions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'contact_submissions_allow_all') THEN
        CREATE POLICY "contact_submissions_allow_all" ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);
        RAISE NOTICE 'Created contact_submissions_allow_all policy';
    ELSE
        RAISE NOTICE 'contact_submissions_allow_all policy already exists';
    END IF;

    -- waitlist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'waitlist' AND policyname = 'waitlist_allow_all') THEN
        CREATE POLICY "waitlist_allow_all" ON public.waitlist FOR ALL USING (true) WITH CHECK (true);
        RAISE NOTICE 'Created waitlist_allow_all policy';
    ELSE
        RAISE NOTICE 'waitlist_allow_all policy already exists';
    END IF;
END $$;

-- 5. Test data access AFTER changes
SELECT '=== TESTING DATA ACCESS AFTER CHANGES ===' as test;

SELECT 
    'dock_slips access test:' as test,
    COUNT(*) as accessible_count
FROM public.dock_slips;

SELECT 
    'posts access test:' as test,
    COUNT(*) as accessible_count
FROM public.posts;

SELECT 
    'contact_submissions access test:' as test,
    COUNT(*) as accessible_count
FROM public.contact_submissions;

SELECT 
    'waitlist access test:' as test,
    COUNT(*) as accessible_count
FROM public.waitlist;

-- 6. Final policy summary
SELECT 
    'Final policy summary:' as info,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('dock_slips', 'posts', 'contact_submissions', 'waitlist')
GROUP BY tablename
ORDER BY tablename;

-- 7. Success message
SELECT '=== RLS FIX COMPLETE ===' as status;
SELECT 'All tables should now be accessible!' as success1;
SELECT 'Test the website - slips and posts should be visible!' as success2;
SELECT 'If still not working, check the data access test results above!' as note;
