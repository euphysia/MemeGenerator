import { NextRequest, NextResponse } from 'next/server';
import { memeService, createApiResponse, handleSupabaseError } from '@/lib/supabase';

// GET /api/memes/[id] - Get a specific meme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        createApiResponse(false, null, 'Meme ID is required'),
        { status: 400 }
      );
    }

    const response = await memeService.getMemeById(id);
    
    if (response.error) {
      return NextResponse.json(
        createApiResponse(false, null, handleSupabaseError(response.error)),
        { status: 500 }
      );
    }

    if (!response.data) {
      return NextResponse.json(
        createApiResponse(false, null, 'Meme not found'),
        { status: 404 }
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

// PUT /api/memes/[id] - Update a meme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { image_url, top_text, bottom_text } = body;

    if (!id) {
      return NextResponse.json(
        createApiResponse(false, null, 'Meme ID is required'),
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (image_url !== undefined) updateData.image_url = image_url;
    if (top_text !== undefined) updateData.top_text = top_text;
    if (bottom_text !== undefined) updateData.bottom_text = bottom_text;

    const response = await memeService.updateMeme(id, updateData);
    
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

// DELETE /api/memes/[id] - Delete a meme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        createApiResponse(false, null, 'Meme ID is required'),
        { status: 400 }
      );
    }

    const response = await memeService.deleteMeme(id);
    
    if (response.error) {
      return NextResponse.json(
        createApiResponse(false, null, handleSupabaseError(response.error)),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiResponse(true, null, undefined),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      createApiResponse(false, null, handleSupabaseError(error)),
      { status: 500 }
    );
  }
} 