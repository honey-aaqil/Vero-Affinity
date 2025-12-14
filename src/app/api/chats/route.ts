import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/server/auth';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/server/mongo';
import { Message } from '@/lib/types';

// In-memory store for demo (replace with actual database in production)
const messagesStore: Message[] = [];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      messages: messagesStore
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, type = 'text' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    const newMessage: Message = {
      id: new ObjectId().toString(),
      text: text.trim(),
      sender: user.username,
      timestamp: new Date(),
      type
    };

    messagesStore.push(newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}