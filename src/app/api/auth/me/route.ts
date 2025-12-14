import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/lib/server/auth';
import { getDb } from '@/lib/server/mongo';
import { ObjectId } from 'mongodb';
import { User } from '@/lib/server/types';

export async function GET(request: NextRequest) {
  try {
    const session = await readSession(request.headers.get('cookie') || undefined);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get fresh user data from database
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ 
      _id: new ObjectId(session.userId) 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Return sanitized user profile
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}