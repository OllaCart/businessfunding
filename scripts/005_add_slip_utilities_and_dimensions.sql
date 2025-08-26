-- Add beam capacity and detailed utilities to dock_slips table
ALTER TABLE public.dock_slips 
ADD COLUMN IF NOT EXISTS beam_capacity INTEGER, -- boat beam capacity in feet
ADD COLUMN IF NOT EXISTS has_water BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_electric BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS electric_amp INTEGER, -- 30, 50, 100 amp service
ADD COLUMN IF NOT EXISTS has_cable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_wifi BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_pump_out BOOLEAN DEFAULT false;

-- Update existing slips with utility information
UPDATE public.dock_slips SET 
  beam_capacity = CASE 
    WHEN capacity <= 25 THEN 8
    WHEN capacity <= 35 THEN 12
    WHEN capacity <= 45 THEN 14
    ELSE 16
  END,
  has_water = true,
  has_electric = true,
  electric_amp = CASE 
    WHEN capacity <= 30 THEN 30
    WHEN capacity <= 40 THEN 50
    ELSE 100
  END,
  has_cable = capacity >= 35,
  has_wifi = true,
  has_pump_out = capacity >= 40;

-- Rename capacity to length_capacity for clarity
ALTER TABLE public.dock_slips RENAME COLUMN capacity TO length_capacity;
