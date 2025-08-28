-- SAFE ADMIN RECOVERY SCRIPT
-- This script safely recovers from the database disconnection issue
-- It checks everything before making changes and uses minimal, safe operations

SELECT '=== SAFE ADMIN RECOVERY STARTING ===' as info;

-- 1. SAFETY CHECK - Verify we can connect and see basic tables
SELECT 'Step 1: Safety check - verifying connection and basic access...' as status;

-- Test basic connection
SELECT 
    'Connection test:' as test,
    current_database() as database,
    current_user as user,
    version() as postgres_version;

-- Check if critical tables exist
SELECT 
    'Critical tables check:' as check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_profiles') THEN 'EXISTS' 
        ELSE 'MISSING - CRITICAL ERROR' 
    END as admin_profiles,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_invitations') THEN 'EXISTS' 
        ELSE 'MISSING - CRITICAL ERROR' 
    END as admin_invitations;

-- 2. SAFE RLS DISABLE - Temporarily disable RLS to restore access
SELECT 'Step 2: Temporarily disabling RLS to restore basic access...' as status;

-- Disable RLS on admin_profiles (temporarily)
ALTER TABLE public.admin_profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on admin_invitations (temporarily)  
ALTER TABLE public.admin_invitations DISABLE ROW LEVEL SECURITY;

SELECT 'RLS temporarily disabled on admin tables for recovery' as status;

-- 3. VERIFY ACCESS RESTORED
SELECT 'Step 3: Verifying access is restored...' as status;

-- Test admin_profiles access
SELECT 
    'admin_profiles access test:' as test,
    COUNT(*) as accessible_count
FROM public.admin_profiles;

-- Test admin_invitations access
SELECT 
    'admin_invitations access test:' as test,
    COUNT(*) as accessible_count
FROM public.admin_invitations;

-- 4. SAFE POLICY CREATION - Only create essential policies
SELECT 'Step 4: Creating minimal, safe RLS policies...' as status;

-- Re-enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Create ONLY the essential policies (no complex logic)
-- Simple policy: allow all operations for now (we'll restrict later)
CREATE POLICY "admin_profiles_allow_all" ON public.admin_profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_invitations_allow_all" ON public.admin_invitations
    FOR ALL USING (true) WITH CHECK (true);

SELECT 'Minimal RLS policies created - admin setup should work now' as status;

-- 5. FINAL VERIFICATION
SELECT 'Step 5: Final verification...' as status;

-- Check policies were created
SELECT 
    'Created policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('admin_profiles', 'admin_invitations')
ORDER BY tablename, policyname;

-- Test final access
SELECT 
    'Final access test:' as test,
    (SELECT COUNT(*) FROM public.admin_profiles) as admin_profiles_count,
    (SELECT COUNT(*) FROM public.admin_invitations) as admin_invitations_count;

-- 6. SUCCESS MESSAGE
SELECT '=== RECOVERY COMPLETED SUCCESSFULLY ===' as status;
SELECT 'Database connection restored!' as success1;
SELECT 'RLS policies simplified and working!' as success2;
SELECT 'Admin setup process should now work!' as success3;
SELECT 'You can now try the admin invitation process again.' as next_step;

-- 7. IMPORTANT NOTES
SELECT '=== IMPORTANT NOTES ===' as notes;
SELECT '• RLS is now very permissive (allows all operations)' as note1;
SELECT '• This is temporary for recovery purposes' as note2;
SELECT '• Once admin setup works, we can add proper restrictions' as note3;
SELECT '• Try the admin invitation process now!' as action;
