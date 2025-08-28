-- CREATE SIMPLE ADMIN INVITATION SYSTEM
-- This system allows admins to invite new users who set their own passwords

SELECT '=== CREATING SIMPLE ADMIN INVITATION SYSTEM ===' as info;

-- 1. Create admin_invitations table for secure invitations
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  invited_by UUID REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on the new table
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
SELECT 'Dropping existing policies to avoid conflicts...' as status;

DROP POLICY IF EXISTS "admin_invitations_insert_admins" ON public.admin_invitations;
DROP POLICY IF EXISTS "admin_invitations_select_admins" ON public.admin_invitations;
DROP POLICY IF EXISTS "admin_invitations_select_by_token" ON public.admin_invitations;
DROP POLICY IF EXISTS "admin_invitations_update_by_token" ON public.admin_invitations;

-- 4. Create RLS policies for admin_invitations
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

-- 5. Create indexes for efficient lookups
SELECT 'Creating indexes...' as status;

CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires ON public.admin_invitations(expires_at);

-- 6. Grant permissions
GRANT ALL ON public.admin_invitations TO authenticated;

-- 7. Test the new table
SELECT '=== TESTING NEW TABLE ===' as info;

SELECT 
    'admin_invitations table created:' as test,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_name = 'admin_invitations';

-- 8. Show final status
SELECT '=== ADMIN INVITATION SYSTEM CREATED ===' as status;

-- Show the new policies
SELECT 
    'New RLS policies:' as info,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'admin_invitations'
ORDER BY policyname;

SELECT 'Admin invitation system is ready to use!' as success_message;
