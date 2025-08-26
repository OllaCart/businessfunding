-- Create admin profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin profiles policies
CREATE POLICY "admin_profiles_select_own" ON public.admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_profiles_insert_own" ON public.admin_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "admin_profiles_update_own" ON public.admin_profiles FOR UPDATE USING (auth.uid() = id);

-- Create dock slips table
CREATE TABLE IF NOT EXISTS public.dock_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL, -- boat length capacity in feet
  slip_type TEXT NOT NULL, -- 'covered', 'uncovered', 'premium'
  monthly_rate DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  description TEXT,
  amenities TEXT[], -- array of amenities like 'power', 'water', 'wifi'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- No RLS needed for dock slips as they are public information
-- But we'll add policies for admin management
ALTER TABLE public.dock_slips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dock_slips_select_all" ON public.dock_slips FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "dock_slips_admin_all" ON public.dock_slips FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Create posts table for marina updates
CREATE TABLE IF NOT EXISTS public.posts (
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

-- Posts are public to read, admin to manage
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_select_published" ON public.posts FOR SELECT TO PUBLIC USING (is_published = true);
CREATE POLICY "posts_admin_all" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  boat_length INTEGER, -- in feet
  preferred_slip_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'converted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist is admin-only to view/manage, public to insert
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_insert_public" ON public.waitlist FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "waitlist_admin_all" ON public.waitlist FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'responded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions are admin-only to view, public to insert
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_insert_public" ON public.contact_submissions FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "contact_admin_all" ON public.contact_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);
