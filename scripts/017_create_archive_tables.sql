-- Create archive system for MarinaBTS user management and email lists
-- This will store historical data from waitlist, contacts, and former slip occupants

-- Create archive table for all user interactions
CREATE TABLE IF NOT EXISTS public.user_archive (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    boat_length INTEGER,
    message TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('waitlist', 'contact', 'former_occupant', 'general_interest')),
    source_details JSONB, -- Store additional context about the source
    slip_number TEXT, -- If they were associated with a specific slip
    status TEXT DEFAULT 'archived' CHECK (status IN ('active', 'archived', 'unsubscribed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT, -- Admin notes about the user
    tags TEXT[] -- For categorizing users (e.g., ['boat_owner', 'interested_in_slip', 'newsletter_subscriber'])
);

-- Create email campaigns table to track bulk emails sent
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    recipient_count INTEGER NOT NULL,
    recipient_types TEXT[] NOT NULL, -- ['waitlist', 'contact', 'former_occupant', 'general_interest']
    filters JSONB, -- Store any filters applied (e.g., boat length, source type, tags)
    sent_by UUID REFERENCES auth.users(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sending', 'sent', 'failed'))
);

-- Create email campaign recipients table to track who received each campaign
CREATE TABLE IF NOT EXISTS public.email_campaign_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
    user_archive_id UUID REFERENCES public.user_archive(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
    error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_archive_email ON public.user_archive(email);
CREATE INDEX IF NOT EXISTS idx_user_archive_source_type ON public.user_archive(source_type);
CREATE INDEX IF NOT EXISTS idx_user_archive_status ON public.user_archive(status);
CREATE INDEX IF NOT EXISTS idx_user_archive_created_at ON public.user_archive(created_at);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sent_at ON public.email_campaigns(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_id ON public.email_campaign_recipients(campaign_id);

-- Enable Row Level Security
ALTER TABLE public.user_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Allow admins to manage user archive" ON public.user_archive
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage email campaigns" ON public.email_campaigns
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage email campaign recipients" ON public.email_campaign_recipients
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to archive a user when they're removed from waitlist
CREATE OR REPLACE FUNCTION archive_waitlist_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_archive (
        email,
        full_name,
        phone,
        boat_length,
        message,
        source_type,
        source_details,
        slip_number,
        notes
    ) VALUES (
        OLD.email,
        OLD.full_name,
        OLD.phone,
        OLD.boat_length,
        OLD.message,
        'waitlist',
        jsonb_build_object(
            'waitlist_id', OLD.id,
            'preferred_slip_type', OLD.preferred_slip_type,
            'waitlist_created_at', OLD.created_at
        ),
        NULL,
        'Automatically archived when removed from waitlist'
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically archive waitlist users when deleted
CREATE TRIGGER trigger_archive_waitlist_user
    AFTER DELETE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION archive_waitlist_user();

-- Create function to archive contact submissions
CREATE OR REPLACE FUNCTION archive_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_archive (
        email,
        full_name,
        phone,
        message,
        source_type,
        source_details,
        notes
    ) VALUES (
        NEW.email,
        NEW.full_name,
        NEW.phone,
        NEW.message,
        'contact',
        jsonb_build_object(
            'contact_id', NEW.id,
            'contact_created_at', NEW.created_at
        ),
        'Contact form submission'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically archive contact submissions
CREATE TRIGGER trigger_archive_contact_submission
    AFTER INSERT ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION archive_contact_submission();

-- Insert sample data for testing
INSERT INTO public.user_archive (email, full_name, phone, source_type, notes) VALUES
('john.doe@example.com', 'John Doe', '+1234567890', 'general_interest', 'Sample archived user'),
('jane.smith@example.com', 'Jane Smith', '+1987654321', 'former_occupant', 'Former slip 5 occupant'),
('bob.wilson@example.com', 'Bob Wilson', '+1555666777', 'waitlist', 'Archived from waitlist');

-- Grant necessary permissions
GRANT ALL ON public.user_archive TO authenticated;
GRANT ALL ON public.email_campaigns TO authenticated;
GRANT ALL ON public.email_campaign_recipients TO authenticated;

-- Show the created tables
SELECT 'Tables created successfully' as status;
SELECT table_name, table_type FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('user_archive', 'email_campaigns', 'email_campaign_recipients')
ORDER BY table_name;
