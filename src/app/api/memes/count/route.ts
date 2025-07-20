import { NextResponse } from 'next/server';
import { memeService, createApiResponse, handleSupabaseError } from '@/lib/supabase';

// GET /api/memes/count - Get total count of memes
export async function GET() {
  try {
    const count = await memeService.getMemeCount();
    
    return NextResponse.json(
      createApiResponse(true, { count }, undefined),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, handleSupabaseError(error)),
      { status: 500 }
    );
  }
} 