-- Recovery script for dock_slips and posts tables
-- This script restores the tables if they were accidentally deleted

-- First, check what exists
SELECT 'Checking current database state...' as info;

-- Check if dock_slips table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dock_slips')
        THEN 'dock_slips table EXISTS'
        ELSE 'dock_slips table MISSING'
    END as dock_slips_status;

-- Check if posts table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts')
        THEN 'posts table EXISTS'
        ELSE 'posts table MISSING'
    END as posts_status;

-- If dock_slips table is missing, recreate it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dock_slips') THEN
        RAISE NOTICE 'Recreating dock_slips table...';
        
        CREATE TABLE public.dock_slips (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            slip_number TEXT NOT NULL UNIQUE,
            capacity INTEGER NOT NULL,
            slip_type TEXT NOT NULL,
            monthly_rate DECIMAL(10,2) NOT NULL,
            is_available BOOLEAN DEFAULT true,
            description TEXT,
            amenities TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.dock_slips ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "dock_slips_select_all" ON public.dock_slips FOR SELECT TO PUBLIC USING (true);
        CREATE POLICY "dock_slips_admin_all" ON public.dock_slips FOR ALL USING (
            EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
        );
        
        RAISE NOTICE 'dock_slips table recreated successfully!';
    ELSE
        RAISE NOTICE 'dock_slips table already exists';
    END IF;
END $$;

-- If posts table is missing, recreate it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        RAISE NOTICE 'Recreating posts table...';
        
        CREATE TABLE public.posts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT,
            featured_image_url TEXT,
            author_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
            is_published BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "posts_select_published" ON public.posts FOR SELECT TO PUBLIC USING (is_published = true);
        CREATE POLICY "posts_admin_all" ON public.posts FOR ALL USING (
            EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
        );
        
        RAISE NOTICE 'posts table recreated successfully!';
    ELSE
        RAISE NOTICE 'posts table already exists';
    END IF;
END $$;

-- Now restore sample data if tables are empty
-- Check dock_slips count
DO $$
DECLARE
    slip_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO slip_count FROM public.dock_slips;
    
    IF slip_count = 0 THEN
        RAISE NOTICE 'Restoring sample dock slips data...';
        
        INSERT INTO public.dock_slips (slip_number, capacity, slip_type, monthly_rate, is_available, description, amenities) VALUES
        ('A1', 30, 'covered', 450.00, true, 'Premium covered slip with power and water', ARRAY['power', 'water', 'wifi']),
        ('A2', 35, 'covered', 500.00, true, 'Large covered slip with full amenities', ARRAY['power', 'water', 'wifi', 'security']),
        ('B1', 25, 'uncovered', 350.00, false, 'Standard uncovered slip', ARRAY['power', 'water']),
        ('B2', 28, 'uncovered', 375.00, true, 'Uncovered slip with power access', ARRAY['power', 'water']),
        ('C1', 40, 'premium', 600.00, true, 'Premium slip with concierge service', ARRAY['power', 'water', 'wifi', 'security', 'concierge']),
        ('C2', 45, 'premium', 650.00, true, 'Extra large premium slip', ARRAY['power', 'water', 'wifi', 'security', 'concierge']);
        
        RAISE NOTICE 'Sample dock slips data restored!';
    ELSE
        RAISE NOTICE 'Dock slips table has % existing records', slip_count;
    END IF;
END $$;

-- Check posts count
DO $$
DECLARE
    post_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO post_count FROM public.posts;
    
    IF post_count = 0 THEN
        RAISE NOTICE 'Restoring sample posts data...';
        
        INSERT INTO public.posts (title, content, excerpt, is_published) VALUES
        ('Welcome to Marina By-The-Sea', 'Welcome to our beautiful marina! We offer premium dock slips with full amenities including power, water, wifi, and 24/7 security. Our marina is located in the heart of Lauderdale-By-The-Sea, providing easy access to the ocean and local attractions.', 'Welcome to our beautiful marina with premium amenities and 24/7 security.', true),
        ('New Security Features Added', 'We are excited to announce the addition of enhanced security features to our marina. This includes 24/7 surveillance, secure access gates, and professional security personnel on-site.', 'Enhanced security features including 24/7 surveillance and secure access gates.', true),
        ('Holiday Hours and Special Events', 'Join us for special holiday events and extended hours during peak season. We will be hosting marina open houses and special boat shows throughout the year.', 'Special holiday events and extended hours during peak season.', false);
        
        RAISE NOTICE 'Sample posts data restored!';
    ELSE
        RAISE NOTICE 'Posts table has % existing records', post_count;
    END IF;
END $$;

-- Final status report
SELECT 'Recovery process completed!' as status;

-- Show current data counts
SELECT 
    'Current data status:' as info,
    (SELECT COUNT(*) FROM public.dock_slips) as dock_slips_count,
    (SELECT COUNT(*) FROM public.posts) as posts_count;
