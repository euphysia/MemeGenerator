import { NextRequest, NextResponse } from 'next/server';
import { memeService, createApiResponse, handleSupabaseError } from '@/lib/supabase';
import type { MemeCreation } from '@/types';

// GET /api/memes - Get all memes
export async function GET() {
  try {
    const response = await memeService.getAllMemes();
    
    if (response.error) {
      return NextResponse.json(
        createApiResponse(false, null, handleSupabaseError(response.error)),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, response.data, undefined),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, handleSupabaseError(error)),
      { status: 500 }
    );
  }
}

// POST /api/memes - Create a new meme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, top_text, bottom_text } = body;

    // Validate required fields
    if (!image_url) {
      return NextResponse.json(
        createApiResponse(false, null, 'Image URL is required'),
        { status: 400 }
      );
    }

    const memeData = {
      image_url,
      top_text: top_text || '',
      bottom_text: bottom_text || ''
    };

    const response = await memeService.createMeme(memeData);
    
    if (response.error) {
      return NextResponse.json(
        createApiResponse(false, null, handleSupabaseError(response.error)),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, response.data, undefined),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, handleSupabaseError(error)),
      { status: 500 }
    );
  }
} 