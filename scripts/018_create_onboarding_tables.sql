-- Create onboarding system tables for Marina By-The-Sea
-- This script adds tables for slip offers, occupant applications, and payment methods

-- 1. Update waitlist table to add status tracking
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'waitlisted' CHECK (status IN ('waitlisted', 'offered', 'pending_occupant', 'occupant')),
ADD COLUMN IF NOT EXISTS offered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS offer_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS slip_offer_id UUID REFERENCES public.slip_offers(id);

-- 2. Create slip_offers table
CREATE TABLE IF NOT EXISTS public.slip_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    waitlist_entry_id UUID NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
    slip_id UUID NOT NULL REFERENCES public.dock_slips(id),
    admin_id UUID NOT NULL REFERENCES public.admin_profiles(id),
    offered_price_per_foot DECIMAL(10,2) NOT NULL,
    monthly_tax_rate DECIMAL(5,4) DEFAULT 0.07, -- 7% default tax rate
    total_monthly_cost DECIMAL(10,2) NOT NULL,
    offer_password VARCHAR(100) NOT NULL UNIQUE,
    offer_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'withdrawn')),
    terms_and_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create occupant_applications table
CREATE TABLE IF NOT EXISTS public.occupant_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slip_offer_id UUID NOT NULL REFERENCES public.slip_offers(id) ON DELETE CASCADE,
    waitlist_entry_id UUID NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
    slip_id UUID NOT NULL REFERENCES public.dock_slips(id),
    
    -- Boat Owner Information
    owner_names TEXT NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_mailing_address TEXT NOT NULL,
    owner_phone_numbers TEXT NOT NULL,
    owner_drivers_license VARCHAR(100) NOT NULL,
    owner_drivers_license_state VARCHAR(2) NOT NULL,
    vehicle_license_plates TEXT,
    boat_operators TEXT,
    
    -- Boat Information
    boat_name VARCHAR(255),
    boat_make VARCHAR(255) NOT NULL,
    boat_model VARCHAR(255) NOT NULL,
    boat_year INTEGER NOT NULL,
    boat_length DECIMAL(5,2) NOT NULL,
    boat_draft DECIMAL(4,2),
    boat_beam DECIMAL(4,2),
    boat_registration_number VARCHAR(100) NOT NULL,
    
    -- Rate Information
    cost_per_foot DECIMAL(10,2) NOT NULL,
    monthly_taxes DECIMAL(10,2) NOT NULL,
    total_monthly_cost DECIMAL(10,2) NOT NULL,
    slip_number VARCHAR(50) NOT NULL,
    primary_payment_method VARCHAR(50) NOT NULL CHECK (primary_payment_method IN ('ACH', 'Credit Card')),
    starting_date DATE NOT NULL,
    estimated_end_date DATE,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.admin_profiles(id),
    
    -- Document Uploads (file paths/URLs)
    insurance_document_url TEXT,
    registration_document_url TEXT,
    id_document_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    occupant_application_id UUID NOT NULL REFERENCES public.occupant_applications(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('ACH', 'Credit Card')),
    
    -- ACH Information
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    account_number_encrypted TEXT, -- Store encrypted
    routing_number_encrypted TEXT, -- Store encrypted
    account_type VARCHAR(50) CHECK (account_type IN ('Checking', 'Savings')),
    
    -- Credit Card Information (store only last 4 digits and encrypted token)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    card_expiry_month INTEGER,
    card_expiry_year INTEGER,
    card_token_encrypted TEXT, -- Store encrypted payment processor token
    
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create application_documents table for file management
CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    occupant_application_id UUID NOT NULL REFERENCES public.occupant_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('insurance', 'registration', 'id_document', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES public.admin_profiles(id)
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_slip_offer_id ON public.waitlist(slip_offer_id);
CREATE INDEX IF NOT EXISTS idx_slip_offers_waitlist_entry_id ON public.slip_offers(waitlist_entry_id);
CREATE INDEX IF NOT EXISTS idx_slip_offers_slip_id ON public.slip_offers(slip_id);
CREATE INDEX IF NOT EXISTS idx_slip_offers_status ON public.slip_offers(status);
CREATE INDEX IF NOT EXISTS idx_slip_offers_password ON public.slip_offers(offer_password);
CREATE INDEX IF NOT EXISTS idx_occupant_applications_slip_offer_id ON public.occupant_applications(slip_offer_id);
CREATE INDEX IF NOT EXISTS idx_occupant_applications_status ON public.occupant_applications(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_application_id ON public.payment_methods(occupant_application_id);
CREATE INDEX IF NOT EXISTS idx_application_documents_application_id ON public.application_documents(occupant_application_id);

-- 7. Create RLS policies for security
ALTER TABLE public.slip_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Admin policies for slip_offers
CREATE POLICY "slip_offers_admin_all" ON public.slip_offers
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE admin_profiles.id = auth.uid() 
        AND admin_profiles.role = 'admin'
    ));

-- Admin policies for occupant_applications
CREATE POLICY "occupant_applications_admin_all" ON public.occupant_applications
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE admin_profiles.id = auth.uid() 
        AND admin_profiles.role = 'admin'
    ));

-- Admin policies for payment_methods
CREATE POLICY "payment_methods_admin_all" ON public.payment_methods
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE admin_profiles.id = auth.uid() 
        AND admin_profiles.role = 'admin'
    ));

-- Admin policies for application_documents
CREATE POLICY "application_documents_admin_all" ON public.application_documents
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE admin_profiles.id = auth.uid() 
        AND admin_profiles.role = 'admin'
    ));

-- Public read access for slip offers (needed for password verification)
CREATE POLICY "slip_offers_public_read" ON public.slip_offers
    FOR SELECT USING (true);

-- Public insert access for occupant applications (needed for form submission)
CREATE POLICY "occupant_applications_public_insert" ON public.occupant_applications
    FOR INSERT WITH CHECK (true);

-- Public insert access for payment methods (needed for form submission)
CREATE POLICY "payment_methods_public_insert" ON public.payment_methods
    FOR INSERT WITH CHECK (true);

-- Public insert access for application documents (needed for file uploads)
CREATE POLICY "application_documents_public_insert" ON public.application_documents
    FOR INSERT WITH CHECK (true);

-- 8. Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_slip_offers_updated_at BEFORE UPDATE ON public.slip_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_occupant_applications_updated_at BEFORE UPDATE ON public.occupant_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create function to generate secure passwords
CREATE OR REPLACE FUNCTION generate_offer_password()
RETURNS VARCHAR(100) AS $$
DECLARE
    password VARCHAR(100);
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    i INTEGER;
BEGIN
    password := '';
    FOR i IN 1..12 LOOP
        password := password || substr(chars, floor(random() * length(chars))::integer + 1, 1);
    END LOOP;
    RETURN password;
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to create slip offer
CREATE OR REPLACE FUNCTION create_slip_offer(
    p_waitlist_entry_id UUID,
    p_slip_id UUID,
    p_admin_id UUID,
    p_offered_price_per_foot DECIMAL(10,2),
    p_total_monthly_cost DECIMAL(10,2),
    p_offer_expires_at TIMESTAMP WITH TIME ZONE,
    p_terms_and_conditions TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    offer_id UUID;
    offer_password VARCHAR(100);
BEGIN
    -- Generate unique password
    LOOP
        offer_password := generate_offer_password();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.slip_offers WHERE offer_password = offer_password);
    END LOOP;
    
    -- Create slip offer
    INSERT INTO public.slip_offers (
        waitlist_entry_id,
        slip_id,
        admin_id,
        offered_price_per_foot,
        total_monthly_cost,
        offer_password,
        offer_expires_at,
        terms_and_conditions
    ) VALUES (
        p_waitlist_entry_id,
        p_slip_id,
        p_admin_id,
        p_offered_price_per_foot,
        p_total_monthly_cost,
        offer_password,
        p_offer_expires_at,
        p_terms_and_conditions
    ) RETURNING id INTO offer_id;
    
    -- Update waitlist entry
    UPDATE public.waitlist 
    SET status = 'offered',
        offered_at = NOW(),
        offer_expires_at = p_offer_expires_at,
        slip_offer_id = offer_id
    WHERE id = p_waitlist_entry_id;
    
    RETURN offer_id;
END;
$$ LANGUAGE plpgsql;

-- 11. Create function to transition to pending occupant
CREATE OR REPLACE FUNCTION transition_to_pending_occupant(p_slip_offer_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.waitlist 
    SET status = 'pending_occupant'
    WHERE slip_offer_id = p_slip_offer_id;
    
    UPDATE public.slip_offers 
    SET status = 'accepted'
    WHERE id = p_slip_offer_id;
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to complete onboarding
CREATE OR REPLACE FUNCTION complete_onboarding(p_occupant_application_id UUID, p_admin_id UUID)
RETURNS VOID AS $$
DECLARE
    v_waitlist_entry_id UUID;
    v_slip_id UUID;
BEGIN
    -- Get application details
    SELECT waitlist_entry_id, slip_id INTO v_waitlist_entry_id, v_slip_id
    FROM public.occupant_applications 
    WHERE id = p_occupant_application_id;
    
    -- Update application status
    UPDATE public.occupant_applications 
    SET status = 'completed',
        reviewed_at = NOW(),
        reviewed_by = p_admin_id
    WHERE id = p_occupant_application_id;
    
    -- Update waitlist status
    UPDATE public.waitlist 
    SET status = 'occupant'
    WHERE id = v_waitlist_entry_id;
    
    -- Update slip availability
    UPDATE public.dock_slips 
    SET is_available = false
    WHERE id = v_slip_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Insert sample data for testing (optional)
-- INSERT INTO public.slip_offers (waitlist_entry_id, slip_id, admin_id, offered_price_per_foot, total_monthly_cost, offer_password, offer_expires_at)
-- VALUES (
--     (SELECT id FROM public.waitlist LIMIT 1),
--     (SELECT id FROM public.dock_slips WHERE is_available = true LIMIT 1),
--     (SELECT id FROM public.admin_profiles LIMIT 1),
--     25.00,
--     750.00,
--     'TestPass123',
--     NOW() + INTERVAL '7 days'
-- );

COMMENT ON TABLE public.slip_offers IS 'Tracks slip offers made to waitlisted boaters';
COMMENT ON TABLE public.occupant_applications IS 'Stores completed applications from boaters for slip occupancy';
COMMENT ON TABLE public.payment_methods IS 'Stores payment method information for recurring payments';
COMMENT ON TABLE public.application_documents IS 'Manages document uploads for applications';

COMMENT ON FUNCTION create_slip_offer IS 'Creates a new slip offer with unique password and updates waitlist status';
COMMENT ON FUNCTION transition_to_pending_occupant IS 'Transitions waitlisted boater to pending occupant status';
COMMENT ON FUNCTION complete_onboarding IS 'Completes the onboarding process and marks slip as occupied';
