-- Create current_occupants table for tracking who is currently in each slip
CREATE TABLE IF NOT EXISTS public.current_occupants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_id UUID REFERENCES public.dock_slips(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL DEFAULT 'Slipholder',
  email TEXT,
  phone TEXT,
  boat_name TEXT,
  boat_length INTEGER,
  boat_beam INTEGER,
  contract_start_date DATE DEFAULT CURRENT_DATE,
  contract_end_date DATE,
  monthly_rate DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for current occupants
ALTER TABLE public.current_occupants ENABLE ROW LEVEL SECURITY;

-- Admin can manage all current occupants
CREATE POLICY "current_occupants_admin_all" ON public.current_occupants 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
);

-- Public can view current occupants (for transparency)
CREATE POLICY "current_occupants_select_public" ON public.current_occupants 
FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_current_occupants_slip_id ON public.current_occupants(slip_id);
CREATE INDEX IF NOT EXISTS idx_current_occupants_contract_end ON public.current_occupants(contract_end_date);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.current_occupants TO authenticated;

-- Insert default occupants for currently occupied slips
-- Use a more robust approach that handles potential duplicates
INSERT INTO public.current_occupants (slip_id, full_name, email, phone, boat_name, boat_length, boat_beam, monthly_rate)
SELECT 
  id,
  CONCAT('Slipholder Slip ', slip_number) as full_name,
  'contact@marinabts.com' as email,
  '(954) 790-1588' as phone,
  'Boat Name' as boat_name,
  length_capacity as boat_length,
  beam_capacity as boat_beam,
  monthly_rate
FROM public.dock_slips 
WHERE is_available = false
  AND id NOT IN (SELECT slip_id FROM public.current_occupants WHERE slip_id IS NOT NULL);

-- Update dock_slips to reference current_occupants
ALTER TABLE public.dock_slips 
ADD COLUMN IF NOT EXISTS current_occupant_id UUID REFERENCES public.current_occupants(id);

-- Update existing dock_slips with current_occupant_id
UPDATE public.dock_slips 
SET current_occupant_id = co.id
FROM public.current_occupants co
WHERE dock_slips.id = co.slip_id;

-- Verify the setup
SELECT 
  'Setup Complete' as status,
  COUNT(*) as total_occupants,
  COUNT(CASE WHEN slip_id IS NOT NULL THEN 1 END) as linked_occupants
FROM public.current_occupants;
