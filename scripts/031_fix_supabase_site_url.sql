-- FIX SUPABASE SITE URL CONFIGURATION
-- This script helps fix the Supabase site URL to prevent confirmation emails pointing to localhost

SELECT '=== SUPABASE SITE URL CONFIGURATION ===' as info;

-- 1. Check current Supabase configuration
SELECT 'Current Supabase configuration:' as status;

-- This will show the current site URL setting
-- You'll need to check this in your Supabase dashboard

SELECT 'IMPORTANT: Check these settings in your Supabase Dashboard:' as note;

SELECT 
    '1. Go to Authentication > URL Configuration' as step,
    '2. Set Site URL to: https://www.marinabts.com' as setting,
    '3. Set Redirect URLs to include: https://www.marinabts.com/auth/callback' as redirect;

-- 2. Check if we can see any URL-related settings
SELECT 'Checking for URL-related environment variables...' as status;

-- This is informational - the actual fix needs to be done in Supabase dashboard
SELECT 
    'To fix the localhost issue:' as action,
    '1. Go to Supabase Dashboard > Authentication > URL Configuration' as step1,
    '2. Update Site URL from localhost to https://www.marinabts.com' as step2,
    '3. Add https://www.marinabts.com/auth/callback to Redirect URLs' as step3,
    '4. Save the configuration' as step4;

-- 3. Verify the fix will work
SELECT '=== EXPECTED RESULT ===' as info;
SELECT 
    'After fixing the site URL:' as result,
    '• Confirmation emails will point to marinabts.com' as email_fix,
    '• Auth redirects will work properly' as auth_fix,
    '• Admin setup process will complete successfully' as setup_fix;

SELECT 'Fix the Supabase site URL in your dashboard, then run the admin setup again!' as final_note;
