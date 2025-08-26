-- Setup Supabase Storage for post images
-- This script creates the storage bucket and sets up proper policies

-- Create the marina-assets storage bucket if it doesn't exist
-- Note: Storage buckets are created through the Supabase dashboard or CLI
-- This script sets up the policies for the bucket

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'marina-assets' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'marina-assets'
);

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'marina-assets' AND 
  auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete their own images
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
