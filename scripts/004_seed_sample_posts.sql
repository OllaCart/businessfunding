-- Note: This will only work after an admin user is created
-- Insert sample posts (you'll need to replace the author_id with actual admin user ID)
INSERT INTO public.posts (title, content, excerpt, is_published) VALUES
('Welcome to Bay Town Marina', 
'We are excited to announce the opening of our state-of-the-art marina facility. With over 50 premium dock slips, full amenities, and 24/7 security, we provide the perfect home for your vessel.',
'Announcing the opening of our premium marina facility with world-class amenities.',
true),

('New Premium Slips Available', 
'We have just completed construction of our new C-dock premium slips, designed specifically for larger yachts up to 45 feet. These slips feature full concierge services, fuel dock access, and valet parking.',
'New luxury slips now available for vessels up to 45 feet.',
true),

('Marina Safety Guidelines', 
'The safety of our marina community is our top priority. Please review our updated safety guidelines including proper docking procedures, emergency protocols, and weather advisories.',
'Important safety guidelines for all marina members.',
true);
