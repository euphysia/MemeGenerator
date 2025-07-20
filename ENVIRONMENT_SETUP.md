# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (this may take a few minutes)
3. Go to your project settings and copy the Project URL and anon/public key

### 2. Database Schema Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `SUPABASE_SCHEMA.sql` into the editor
3. Run the SQL commands to create the database schema

The schema includes:
- `meme_creations` table with proper indexes
- Row Level Security (RLS) policies
- Helper functions for meme operations
- Sample data

### 3. Storage Bucket Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `meme-images`
3. Set the bucket as public
4. Configure the following storage policies in the SQL Editor:

```sql
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'meme-images');

-- Allow public upload access (for demo purposes)
CREATE POLICY "Public Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'meme-images');

-- Allow public update access (for demo purposes)
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'meme-images');

-- Allow public delete access (for demo purposes)
CREATE POLICY "Public Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'meme-images');
```

**Note:** For production, you should implement proper authentication and more restrictive policies.

### 4. Verify Setup

After running the SQL commands, you should have:

- ✅ `meme_creations` table with proper structure
- ✅ Storage bucket `meme-images` configured
- ✅ RLS policies enabled
- ✅ Helper functions created
- ✅ Sample data inserted

## Getting Started

1. Copy the environment variables to `.env.local`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Available

### Task 1 ✅
- Next.js 14 with TypeScript
- Tailwind CSS v4 configuration
- Inter font from Google Fonts
- Basic project structure
- TypeScript interfaces
- UI components

### Task 2 ✅
- Supabase client with proper TypeScript types
- Database schema for `meme_creations` table
- Storage bucket configuration for images
- Utility functions for:
  - `uploadImage(file: File)` - uploads to Supabase storage
  - `createMeme(data: MemeData)` - inserts record
  - `getMemeCount()` - gets total count of memes
- Error handling and TypeScript return types
- API response wrapper types
- File upload functionality in MemeForm

## Troubleshooting

### Common Issues

1. **Environment variables not found**
   - Make sure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Supabase connection errors**
   - Verify your project URL and anon key are correct
   - Check that your Supabase project is active

3. **Storage upload errors**
   - Ensure the `meme-images` bucket exists and is public
   - Verify storage policies are correctly configured

4. **Database errors**
   - Run the SQL schema commands in the correct order
   - Check that RLS policies are enabled

### Support

If you encounter any issues, check the browser console for error messages and refer to the Supabase documentation for additional help. 