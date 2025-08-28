-- EMERGENCY CONNECTION TEST
-- This script ONLY tests connection and basic access - NO CHANGES
-- Use this to see what's working and what's broken

SELECT '=== EMERGENCY CONNECTION TEST ===' as info;
SELECT 'This script only tests - it makes NO changes to your database' as safety_note;

-- 1. BASIC CONNECTION TEST
SELECT '1. Testing basic connection...' as step;

SELECT 
    'Connection status:' as status,
    current_database() as database_name,
    current_user as current_user,
    session_user as session_user,
    current_schema as current_schema;

-- 2. VERSION TEST
SELECT '2. Testing PostgreSQL version...' as step;

SELECT 
    'PostgreSQL version:' as info,
    version() as full_version;

-- 3. SCHEMA ACCESS TEST
SELECT '3. Testing schema access...' as step;

SELECT 
    'Available schemas:' as info,
    schema_name
FROM information_schema.schemata
WHERE schema_name IN ('public', 'auth', 'information_schema')
ORDER BY schema_name;

-- 4. TABLE EXISTENCE TEST
SELECT '4. Testing table existence...' as step;

SELECT 
    'Critical tables:' as check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_profiles') THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as admin_profiles,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_invitations') THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as admin_invitations,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dock_slips') THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as dock_slips,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as posts;

-- 5. RLS STATUS TEST
SELECT '5. Testing RLS status...' as step;

SELECT 
    'RLS status:' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('admin_profiles', 'admin_invitations', 'dock_slips', 'posts')
ORDER BY tablename;

-- 6. POLICY STATUS TEST
SELECT '6. Testing policy status...' as step;

SELECT 
    'Existing policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('admin_profiles', 'admin_invitations')
ORDER BY tablename, policyname;

-- 7. DATA ACCESS TEST (READ-ONLY)
SELECT '7. Testing data access (read-only)...' as step;

-- Test admin_profiles access
SELECT 
    'admin_profiles data:' as test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.admin_profiles LIMIT 1) THEN 'ACCESSIBLE' 
        ELSE 'NOT ACCESSIBLE' 
    END as access_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.admin_profiles LIMIT 1) THEN (SELECT COUNT(*) FROM public.admin_profiles)::text
        ELSE 'N/A' 
    END as record_count;

-- Test admin_invitations access
SELECT 
    'admin_invitations data:' as test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.admin_invitations LIMIT 1) THEN 'ACCESSIBLE' 
        ELSE 'NOT ACCESSIBLE' 
    END as access_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.admin_invitations LIMIT 1) THEN (SELECT COUNT(*) FROM public.admin_invitations)::text
        ELSE 'N/A' 
    END as record_count;

-- 8. FINAL STATUS
SELECT '=== TEST COMPLETED ===' as status;
SELECT 'If you see errors above, the database has connection issues' as note1;
SELECT 'If tables show as MISSING, they may have been dropped' as note2;
SELECT 'If RLS shows as enabled but policies are missing, that explains the 403 errors' as note3;
SELECT 'Use this information to decide which recovery script to run next' as action;
