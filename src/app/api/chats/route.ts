import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getMessages, insertMessage, purgeMessages } from '@/lib/server/chats';
import { requireUser } from '@/lib/server/users';

const sendMessageSchema = z.object({
  text: z.string().min(1).max(10000),
  type: z.enum(['text', 'image', 'voice']).default('text'),
  mediaId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await requireUser();
    
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    
    const messages = await getMessages(limit);
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('GET /api/chats error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    
    const validatedData = sendMessageSchema.parse(body);
    
    const message = await insertMessage(
      user._id.toString(),
      user.username,
      validatedData.text,
      validatedData.type,
      validatedData.mediaId
    );
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('POST /api/chats error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await requireUser();
    
    const count = await purgeMessages();
    
    return NextResponse.json({ deleted: count });
  } catch (error) {
    console.error('DELETE /api/chats error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to purge messages' },
      { status: 500 }
    );
  }
}
