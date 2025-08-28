-- Create admin invitations table for secure admin account setup
-- This table stores invitation tokens that allow new admins to set up their accounts

CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "admin_invitations_insert_admins" ON public.admin_invitations
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

CREATE POLICY "admin_invitations_select_admins" ON public.admin_invitations
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'pending_admin')
        )
    );

CREATE POLICY "admin_invitations_select_by_token" ON public.admin_invitations
    FOR SELECT 
    USING (
        -- Allow selection by token for setup process (no auth required)
        true
    );

CREATE POLICY "admin_invitations_update_by_token" ON public.admin_invitations
    FOR UPDATE 
    USING (
        -- Allow updates for marking invitations as used
        true
    );

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires ON public.admin_invitations(expires_at);

-- Grant permissions
GRANT ALL ON public.admin_invitations TO authenticated;

-- Verify the table was created
SELECT 'Admin invitations table created successfully!' as status;
