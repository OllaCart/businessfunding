-- Transform Marina Database to Business Funding Platform
-- This script transforms the existing marina database structure to support business funding

-- 1. Create loan_programs table (replaces dock_slips)
CREATE TABLE IF NOT EXISTS loan_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    loan_type VARCHAR(100) NOT NULL, -- working capital, equipment financing, commercial, sba, etc.
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    interest_rate_min DECIMAL(5,2) NOT NULL,
    interest_rate_max DECIMAL(5,2) NOT NULL,
    term_length_min INTEGER NOT NULL, -- in months
    term_length_max INTEGER NOT NULL, -- in months
    is_available BOOLEAN DEFAULT true,
    show_rates BOOLEAN DEFAULT true,
    description TEXT,
    requirements TEXT[], -- array of requirements
    processing_time VARCHAR(100) DEFAULT '2-5 business days',
    collateral_required BOOLEAN DEFAULT false,
    credit_score_min INTEGER DEFAULT 600,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create loan_applications table (replaces applications)
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    business_address TEXT NOT NULL,
    business_city VARCHAR(100) NOT NULL,
    business_state VARCHAR(2) NOT NULL,
    business_zip VARCHAR(10) NOT NULL,
    business_phone VARCHAR(20) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    business_website VARCHAR(255),
    years_in_business VARCHAR(50) NOT NULL,
    number_of_employees VARCHAR(50) NOT NULL,
    annual_revenue VARCHAR(50) NOT NULL,
    monthly_revenue VARCHAR(50),
    
    -- Owner Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    ssn VARCHAR(11) NOT NULL, -- XXX-XX-XXXX format
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    
    -- Loan Information
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_purpose TEXT NOT NULL,
    loan_program_id UUID REFERENCES loan_programs(id),
    loan_program_name VARCHAR(255) NOT NULL,
    existing_debt DECIMAL(15,2),
    collateral TEXT,
    
    -- Financial Information
    credit_score VARCHAR(50),
    bankruptcy BOOLEAN DEFAULT false,
    tax_liens BOOLEAN DEFAULT false,
    additional_info TEXT,
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, approved, rejected, funded
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    funded_at TIMESTAMP WITH TIME ZONE
);

-- 3. Update waitlist table for loan programs
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS loan_program_id UUID REFERENCES loan_programs(id),
ADD COLUMN IF NOT EXISTS preferred_loan_amount DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS years_in_business VARCHAR(50),
ADD COLUMN IF NOT EXISTS annual_revenue VARCHAR(50);

-- 4. Update contact_submissions table for business inquiries
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS loan_amount DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS loan_purpose TEXT,
ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(50) DEFAULT 'email';

-- 5. Create business_documents table for application documents
CREATE TABLE IF NOT EXISTS business_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- tax_return, bank_statement, financial_statement, etc.
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES admin_profiles(id)
);

-- 6. Create application_notes table for internal notes
CREATE TABLE IF NOT EXISTS application_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admin_profiles(id),
    note TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general', -- general, review, decision, follow_up
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create loan_offers table for approved applications
CREATE TABLE IF NOT EXISTS loan_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
    offered_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term_length INTEGER NOT NULL, -- in months
    monthly_payment DECIMAL(15,2) NOT NULL,
    total_payment DECIMAL(15,2) NOT NULL,
    offer_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE
);

-- 8. Insert sample loan programs
INSERT INTO loan_programs (program_name, loan_type, min_amount, max_amount, interest_rate_min, interest_rate_max, term_length_min, term_length_max, description, requirements, processing_time, collateral_required, credit_score_min) VALUES
('Fast Working Capital', 'working capital', 10000, 500000, 8.5, 15.0, 6, 24, 'Quick access to working capital for daily operations, inventory, and cash flow needs.', ARRAY['Minimum 1 year in business', 'Monthly revenue of $10,000+', 'No recent bankruptcies'], '24-48 hours', false, 600),
('Equipment Financing', 'equipment financing', 25000, 2000000, 6.5, 12.0, 12, 84, 'Finance new or used equipment with competitive rates and flexible terms.', ARRAY['Equipment appraisal required', 'Minimum 2 years in business', 'Equipment serves as collateral'], '3-5 business days', true, 650),
('Commercial Real Estate', 'commercial', 100000, 10000000, 5.5, 9.5, 60, 300, 'Commercial real estate loans for purchase, refinance, or construction.', ARRAY['Property appraisal required', 'Minimum 3 years in business', 'Down payment of 20%+'], '2-4 weeks', true, 700),
('SBA 7(a) Loan', 'sba', 50000, 5000000, 4.0, 8.0, 60, 300, 'Government-backed SBA loans with favorable terms and lower down payments.', ARRAY['SBA eligibility requirements', 'Business plan required', 'Personal guarantee required'], '4-8 weeks', true, 680),
('Business Line of Credit', 'line of credit', 10000, 500000, 7.0, 18.0, 12, 60, 'Flexible line of credit for ongoing business needs and opportunities.', ARRAY['Minimum 2 years in business', 'Strong cash flow', 'Annual revenue of $100,000+'], '1-2 weeks', false, 650),
('Term Loan', 'term loan', 25000, 1000000, 6.0, 14.0, 12, 120, 'Traditional term loans for business expansion, refinancing, or major purchases.', ARRAY['Minimum 2 years in business', 'Strong financials', 'Business plan for use of funds'], '1-3 weeks', false, 650);

-- 9. Update posts table for business content
UPDATE posts SET 
    title = 'Business Funding Resources',
    content = 'Access our comprehensive library of business funding resources, guides, and tips to help you secure the capital your business needs.',
    meta_description = 'Business funding resources and guides from Sure Thing Lending'
WHERE slug = 'business-resources';

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loan_programs_type ON loan_programs(loan_type);
CREATE INDEX IF NOT EXISTS idx_loan_programs_available ON loan_programs(is_available);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_created ON loan_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_loan_applications_program ON loan_applications(loan_program_id);
CREATE INDEX IF NOT EXISTS idx_business_documents_app ON business_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_application_notes_app ON application_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_loan_offers_app ON loan_offers(application_id);

-- 11. Create RLS policies for loan_programs
ALTER TABLE loan_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available loan programs" ON loan_programs
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage loan programs" ON loan_programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- 12. Create RLS policies for loan_applications
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" ON loan_applications
    FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Admins can view all applications" ON loan_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- 13. Create RLS policies for business_documents
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their application documents" ON business_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM loan_applications 
            WHERE loan_applications.id = business_documents.application_id 
            AND loan_applications.email = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage all documents" ON business_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- 14. Create RLS policies for application_notes
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage application notes" ON application_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- 15. Create RLS policies for loan_offers
ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their loan offers" ON loan_offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM loan_applications 
            WHERE loan_applications.id = loan_offers.application_id 
            AND loan_applications.email = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage loan offers" ON loan_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles 
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- 16. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_loan_programs_updated_at BEFORE UPDATE ON loan_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON loan_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loan_offers_updated_at BEFORE UPDATE ON loan_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. Create function to generate application numbers
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the current counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM loan_applications
    WHERE application_number LIKE 'STL%';
    
    -- Format as STL + 6-digit number
    new_number := 'STL' || LPAD(counter::TEXT, 6, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 18. Create trigger to auto-generate application numbers
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := generate_application_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_number_trigger
    BEFORE INSERT ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_number();

-- 19. Add comments for documentation
COMMENT ON TABLE loan_programs IS 'Business loan programs available for application';
COMMENT ON TABLE loan_applications IS 'Business loan applications submitted by users';
COMMENT ON TABLE business_documents IS 'Documents uploaded for loan applications';
COMMENT ON TABLE application_notes IS 'Internal notes and comments on applications';
COMMENT ON TABLE loan_offers IS 'Loan offers made to approved applications';

-- 20. Grant necessary permissions
GRANT SELECT ON loan_programs TO anon, authenticated;
GRANT INSERT, SELECT ON loan_applications TO anon, authenticated;
GRANT SELECT ON business_documents TO anon, authenticated;
GRANT INSERT ON business_documents TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
