-- Create admin_actions table for logging admin activities
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'email_notify', 'email_call', 'status_update'
  target_type TEXT NOT NULL, -- e.g., 'waitlist_entry', 'slip', 'post'
  target_id UUID, -- ID of the target object
  slip_id UUID REFERENCES public.dock_slips(id) ON DELETE SET NULL,
  details JSONB, -- Additional details about the action
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Admin actions policies - only admins can see their own actions
CREATE POLICY "admin_actions_select_own" ON public.admin_actions 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

CREATE POLICY "admin_actions_insert_own" ON public.admin_actions 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON public.admin_actions(action);

-- Grant permissions
GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
