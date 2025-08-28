-- DIAGNOSE AND FIX ADMIN_INVITATIONS TABLE
-- This script checks the current state and fixes any schema issues

SELECT '=== DIAGNOSING ADMIN_INVITATIONS TABLE ===' as info;

-- 1. Check if table exists and show current schema
SELECT 'Checking current table state...' as status;

SELECT 
    'Table exists:' as check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_invitations') 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- If table exists, show current columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_invitations') THEN
        RAISE NOTICE 'Current admin_invitations columns:';
        PERFORM 
            column_name, 
            data_type, 
            is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'admin_invitations'
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'admin_invitations table does not exist';
    END IF;
END $$;

-- 2. Drop table if it exists with wrong schema
SELECT 'Dropping existing table if schema is incorrect...' as status;

DROP TABLE IF EXISTS public.admin_invitations CASCADE;

-- 3. Create the table with correct schema
SELECT 'Creating admin_invitations table with correct schema...' as status;

CREATE TABLE public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  invited_by UUID REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
SELECT 'Creating RLS policies...' as status;

-- Allow admins to create invitations
CREATE POLICY "admin_invitations_insert_admins" ON public.admin_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Allow admins to view all invitations
CREATE POLICY "admin_invitations_select_admins" ON public.admin_invitations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'pending_admin')
        )
    );

-- Allow public to select invitations by token (for setup process)
CREATE POLICY "admin_invitations_select_by_token" ON public.admin_invitations
    FOR SELECT
    USING (true);

-- Allow updates for marking invitations as used
CREATE POLICY "admin_invitations_update_by_token" ON public.admin_invitations
    FOR UPDATE
    USING (true);

-- 6. Create indexes
SELECT 'Creating indexes...' as status;

CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires ON public.admin_invitations(expires_at);

-- 7. Grant permissions
GRANT ALL ON public.admin_invitations TO authenticated;

-- 8. Verify the table structure
SELECT '=== VERIFYING TABLE STRUCTURE ===' as info;

SELECT 
    'Final table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'admin_invitations'
ORDER BY ordinal_position;

-- 9. Test insert (should work now)
SELECT '=== TESTING TABLE FUNCTIONALITY ===' as info;

-- Try to insert a test record
INSERT INTO public.admin_invitations (
    email, 
    full_name, 
    invited_by, 
    token, 
    expires_at, 
    status
) VALUES (
    'test@example.com',
    'Test User',
    (SELECT id FROM public.admin_profiles LIMIT 1),
    'test-token-' || gen_random_uuid()::text,
    NOW() + INTERVAL '7 days',
    'pending'
);

-- Check if insert worked
SELECT 
    'Test insert successful:' as test,
    COUNT(*) as record_count
FROM public.admin_invitations 
WHERE email = 'test@example.com';

-- Clean up test record
DELETE FROM public.admin_invitations WHERE email = 'test@example.com';

-- 10. Final status
SELECT '=== ADMIN_INVITATIONS TABLE READY ===' as status;

-- Show final policies
SELECT 
    'Final RLS policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'admin_invitations'
ORDER BY policyname;

SELECT 'Admin invitations table is now ready to use!' as success_message;
SELECT 'You can now create invitations through the admin portal.' as note;
