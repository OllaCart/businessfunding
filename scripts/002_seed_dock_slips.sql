-- Insert sample dock slips
INSERT INTO public.dock_slips (slip_number, capacity, slip_type, monthly_rate, is_available, description, amenities) VALUES
('A-1', 25, 'covered', 450.00, true, 'Premium covered slip with full amenities', ARRAY['power', 'water', 'wifi', 'security']),
('A-2', 25, 'covered', 450.00, false, 'Premium covered slip with full amenities', ARRAY['power', 'water', 'wifi', 'security']),
('A-3', 30, 'covered', 525.00, true, 'Large covered slip for bigger vessels', ARRAY['power', 'water', 'wifi', 'security']),
('A-4', 30, 'covered', 525.00, true, 'Large covered slip for bigger vessels', ARRAY['power', 'water', 'wifi', 'security']),
('A-5', 35, 'premium', 650.00, false, 'Premium slip with concierge services', ARRAY['power', 'water', 'wifi', 'security', 'concierge', 'fuel']),

('B-1', 20, 'uncovered', 275.00, true, 'Open slip with basic amenities', ARRAY['power', 'water']),
('B-2', 20, 'uncovered', 275.00, true, 'Open slip with basic amenities', ARRAY['power', 'water']),
('B-3', 22, 'uncovered', 300.00, false, 'Open slip with basic amenities', ARRAY['power', 'water']),
('B-4', 22, 'uncovered', 300.00, true, 'Open slip with basic amenities', ARRAY['power', 'water']),
('B-5', 25, 'uncovered', 350.00, true, 'Larger open slip', ARRAY['power', 'water']),

('C-1', 40, 'premium', 850.00, true, 'Luxury slip for large yachts', ARRAY['power', 'water', 'wifi', 'security', 'concierge', 'fuel', 'pump-out']),
('C-2', 40, 'premium', 850.00, false, 'Luxury slip for large yachts', ARRAY['power', 'water', 'wifi', 'security', 'concierge', 'fuel', 'pump-out']),
('C-3', 45, 'premium', 950.00, true, 'Ultra-premium slip for mega yachts', ARRAY['power', 'water', 'wifi', 'security', 'concierge', 'fuel', 'pump-out', 'valet']),

('D-1', 18, 'uncovered', 225.00, true, 'Compact slip for smaller boats', ARRAY['power']),
('D-2', 18, 'uncovered', 225.00, true, 'Compact slip for smaller boats', ARRAY['power']),
('D-3', 18, 'uncovered', 225.00, false, 'Compact slip for smaller boats', ARRAY['power']),
('D-4', 20, 'uncovered', 250.00, true, 'Standard slip', ARRAY['power', 'water']),
('D-5', 20, 'uncovered', 250.00, true, 'Standard slip', ARRAY['power', 'water']);
