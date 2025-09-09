-- Create First Admin User for Sure Thing Lending
-- Run this script after setting up your first user in Supabase Auth

-- Replace 'your-admin-email@example.com' with your actual admin email
-- This should match the email you used to sign up in Supabase Auth

INSERT INTO admin_profiles (id, email, full_name, role, is_active)
VALUES (
    auth.uid(), -- This will use the current authenticated user's ID
    'admin@surethinglending.com', -- Replace with your admin email
    'Admin User', -- Replace with your name
    'admin',
    true
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Grant admin permissions
-- This ensures the user has full access to all admin functions
UPDATE admin_profiles 
SET role = 'admin', is_active = true 
WHERE email = 'admin@surethinglending.com'; -- Replace with your admin email

-- Verify the admin user was created
SELECT 
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM admin_profiles 
WHERE email = 'admin@surethinglending.com'; -- Replace with your admin email
