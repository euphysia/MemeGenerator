-- Supabase Database Schema for Meme Generator
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create meme_creations table
CREATE TABLE IF NOT EXISTS meme_creations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  top_text TEXT DEFAULT '',
  bottom_text TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meme_creations_created_at ON meme_creations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meme_creations_image_url ON meme_creations(image_url);

-- Enable Row Level Security (RLS)
ALTER TABLE meme_creations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you should implement proper authentication

-- Allow all users to read memes
CREATE POLICY "Allow public read access" ON meme_creations
  FOR SELECT USING (true);

-- Allow all users to create memes
CREATE POLICY "Allow public insert access" ON meme_creations
  FOR INSERT WITH CHECK (true);

-- Allow all users to update their own memes (if you implement user authentication)
CREATE POLICY "Allow public update access" ON meme_creations
  FOR UPDATE USING (true);

-- Allow all users to delete memes (if you implement user authentication)
CREATE POLICY "Allow public delete access" ON meme_creations
  FOR DELETE USING (true);

-- Create storage bucket for meme images
-- Note: This needs to be done through the Supabase dashboard or API
-- The bucket name should be: 'meme-images'

-- Storage bucket configuration (run these commands in Supabase dashboard):
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create a new bucket named 'meme-images'
-- 3. Set it as public
-- 4. Configure the following policies:

-- Policy for public read access to images
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'meme-images');

-- Policy for authenticated users to upload images
-- CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'meme-images' AND auth.role() = 'authenticated');

-- Policy for users to update their own images
-- CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'meme-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to delete their own images
-- CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'meme-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- For demo purposes, allow all operations on storage (not recommended for production)
-- CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'meme-images');

-- Create a function to get meme count
CREATE OR REPLACE FUNCTION get_meme_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM meme_creations);
END;
$$;

-- Create a function to get recent memes
CREATE OR REPLACE FUNCTION get_recent_memes(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  top_text TEXT,
  bottom_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.image_url,
    mc.top_text,
    mc.bottom_text,
    mc.created_at
  FROM meme_creations mc
  ORDER BY mc.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create a function to search memes by text
CREATE OR REPLACE FUNCTION search_memes(search_term TEXT)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  top_text TEXT,
  bottom_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.image_url,
    mc.top_text,
    mc.bottom_text,
    mc.created_at
  FROM meme_creations mc
  WHERE 
    mc.top_text ILIKE '%' || search_term || '%' OR
    mc.bottom_text ILIKE '%' || search_term || '%'
  ORDER BY mc.created_at DESC;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON meme_creations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_meme_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_recent_memes(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_memes(TEXT) TO anon, authenticated;

-- Insert some sample data (optional)
INSERT INTO meme_creations (image_url, top_text, bottom_text) VALUES
  ('https://picsum.photos/400/400?random=1', 'WHEN YOU', 'FINISH THE PROJECT'),
  ('https://picsum.photos/400/400?random=2', 'ME TRYING TO', 'DEBUG MY CODE'),
  ('https://picsum.photos/400/400?random=3', 'PROGRAMMING', 'BE LIKE')
ON CONFLICT DO NOTHING; 