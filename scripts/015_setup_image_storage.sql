-- Setup Supabase Storage for post images
-- This script creates the storage policies for the marina-assets bucket
-- Note: Storage buckets are created through the Supabase dashboard

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- Create policy to allow authenticated users to upload images
-- This policy allows any authenticated user to upload to the marina-assets bucket
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'marina-assets' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow public read access to images
-- This policy allows anyone to view images in the marina-assets bucket
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'marina-assets'
);

-- Create policy to allow authenticated users to update images
-- This policy allows authenticated users to update images in the marina-assets bucket
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'marina-assets' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete images
-- This policy allows authenticated users to delete images in the marina-assets bucket
CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'marina-assets' AND 
  auth.role() = 'authenticated'
);

-- Note: You'll need to create the 'marina-assets' bucket manually in the Supabase dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "Create a new bucket"
-- 3. Name it "marina-assets"
-- 4. Make it public (so images can be accessed without authentication)
-- 5. Set file size limit to 5MB
-- 6. Set allowed MIME types to: image/jpeg, image/jpg, image/png, image/webp, image/gif
--
-- The policies above will automatically apply once the bucket is created.
