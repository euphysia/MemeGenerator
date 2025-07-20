import { createClient } from '@supabase/supabase-js';
import type { MemeCreation, SupabaseResponse, SupabaseMemeResponse, ApiResponse } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only throw error in production
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co')) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for meme images
const STORAGE_BUCKET = 'meme-images';

// Database table name
const MEME_TABLE = 'meme_creations';

// Meme-related database operations
export const memeService = {
  // Get all memes
  async getAllMemes(): Promise<SupabaseMemeResponse> {
    // Return mock data if Supabase is not configured
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      return {
        data: [
          {
            id: '1',
            image_url: 'https://picsum.photos/400/400?random=1',
            top_text: 'WHEN YOU',
            bottom_text: 'FINISH THE PROJECT',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            image_url: 'https://picsum.photos/400/400?random=2',
            top_text: 'ME TRYING TO',
            bottom_text: 'DEBUG MY CODE',
            created_at: new Date().toISOString()
          }
        ],
        error: null,
        count: 2
      };
    }

    return await supabase
      .from(MEME_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
  },

  // Get a single meme by ID
  async getMemeById(id: string): Promise<SupabaseResponse<MemeCreation>> {
    return await supabase
      .from(MEME_TABLE)
      .select('*')
      .eq('id', id)
      .single();
  },

  // Create a new meme
  async createMeme(memeData: Omit<MemeCreation, 'id' | 'created_at'>): Promise<SupabaseResponse<MemeCreation>> {
    return await supabase
      .from(MEME_TABLE)
      .insert([memeData])
      .select()
      .single();
  },

  // Update a meme
  async updateMeme(id: string, memeData: Partial<MemeCreation>): Promise<SupabaseResponse<MemeCreation>> {
    return await supabase
      .from(MEME_TABLE)
      .update(memeData)
      .eq('id', id)
      .select()
      .single();
  },

  // Delete a meme
  async deleteMeme(id: string): Promise<SupabaseResponse<null>> {
    return await supabase
      .from(MEME_TABLE)
      .delete()
      .eq('id', id);
  },

  // Get total count of memes
  async getMemeCount(): Promise<number> {
    // Return mock count if Supabase is not configured
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      return 42;
    }

    try {
      const { count, error } = await supabase
        .from(MEME_TABLE)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Supabase error getting meme count:', error);
        return 42; // Return fallback count
      }
      
      return count || 42;
    } catch (error) {
      console.error('Unexpected error getting meme count:', error);
      return 42; // Return fallback count
    }
  }
};

// Storage operations
export const storageService = {
  // Upload image to Supabase storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Delete image from storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([fileName]);

      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  },

  // Get storage bucket info
  async getBucketInfo() {
    const { data, error } = await supabase.storage.getBucket(STORAGE_BUCKET);
    return { data, error };
  }
};

// API response wrapper
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  error
});

// Error handler
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}; 