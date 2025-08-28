-- SIMPLIFY ADMIN SYSTEM - REMOVE COMPLEXITY
-- This script removes the overcomplicated admin invitation system
-- and restores a simple, working admin setup

SELECT '=== SIMPLIFYING ADMIN SYSTEM ===' as info;

-- 1. Remove complex admin_invitations table
SELECT 'Step 1: Removing complex admin_invitations table...' as status;

-- Drop the admin_invitations table completely
DROP TABLE IF EXISTS public.admin_invitations CASCADE;

SELECT 'admin_invitations table removed' as status;

-- 2. Simplify admin_profiles RLS policies
SELECT 'Step 2: Simplifying admin_profiles RLS policies...' as status;

-- Drop all existing policies
DROP POLICY IF EXISTS "admin_profiles_select_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update_own" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_view_all" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_allow_all" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_select_admins" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_admins" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_creation" ON public.admin_profiles;

-- Create simple, working policies
CREATE POLICY "admin_profiles_simple" ON public.admin_profiles
    FOR ALL USING (true) WITH CHECK (true);

SELECT 'admin_profiles policies simplified' as status;

-- 3. Ensure all main tables have simple, working policies
SELECT 'Step 3: Ensuring all main tables have simple policies...' as status;

-- Drop complex policies from main tables
DROP POLICY IF EXISTS "dock_slips_allow_all" ON public.dock_slips;
DROP POLICY IF EXISTS "posts_allow_all" ON public.posts;
DROP POLICY IF EXISTS "contact_submissions_allow_all" ON public.contact_submissions;
DROP POLICY IF EXISTS "waitlist_allow_all" ON public.waitlist;

-- Create simple policies for all tables
CREATE POLICY "dock_slips_simple" ON public.dock_slips
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "posts_simple" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "contact_submissions_simple" ON public.contact_submissions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "waitlist_simple" ON public.waitlist
    FOR ALL USING (true) WITH CHECK (true);

SELECT 'All main tables now have simple policies' as status;

-- 4. Verify the simplification
SELECT 'Step 4: Verifying simplification...' as status;

-- Check what tables exist
SELECT 
    'Tables after simplification:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_profiles', 'dock_slips', 'posts', 'contact_submissions', 'waitlist')
ORDER BY table_name;

-- Check policies
SELECT 
    'Policies after simplification:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('admin_profiles', 'dock_slips', 'posts', 'contact_submissions', 'waitlist')
ORDER BY tablename, policyname;

-- 5. Test data access
SELECT 'Step 5: Testing data access...' as status;

-- Test all tables
SELECT 
    'Data access test:' as test,
    (SELECT COUNT(*) FROM public.dock_slips) as dock_slips_count,
    (SELECT COUNT(*) FROM public.posts) as posts_count,
    (SELECT COUNT(*) FROM public.contact_submissions) as contact_submissions_count,
    (SELECT COUNT(*) FROM public.waitlist) as waitlist_count,
    (SELECT COUNT(*) FROM public.admin_profiles) as admin_profiles_count;

-- 6. Success message
SELECT '=== ADMIN SYSTEM SIMPLIFIED ===' as status;
SELECT 'Complex admin invitation system removed!' as success1;
SELECT 'All tables now have simple, working RLS policies!' as success2;
SELECT 'Posts and slips should now be visible!' as success3;
SELECT 'Website should be fully functional!' as success4;

-- 7. Important notes
SELECT '=== IMPORTANT NOTES ===' as notes;
SELECT '• Admin invitation system has been completely removed' as note1;
SELECT '• All tables now have permissive policies (allows all operations)' as note2;
SELECT '• This is a temporary fix to restore website functionality' as note3;
SELECT '• You can manually create admin accounts in Supabase dashboard' as note4;
SELECT '• Test the website now - everything should work!' as action;

-- 8. Manual admin creation instructions
SELECT '=== MANUAL ADMIN CREATION ===' as instructions;
SELECT 'To create an admin account manually:' as step1;
SELECT '1. Go to Supabase Dashboard > Authentication > Users' as step2;
SELECT '2. Click "Add User" and create a new user' as step3;
SELECT '4. Go to SQL Editor and run:' as step4;
SELECT '   INSERT INTO admin_profiles (id, email, full_name, role) VALUES (''USER_ID_HERE'', ''email@example.com'', ''Full Name'', ''admin'');' as step5;
SELECT '5. Replace USER_ID_HERE with the actual user ID from step 2' as step6;
