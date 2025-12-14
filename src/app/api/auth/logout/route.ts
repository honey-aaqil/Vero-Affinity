import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/server/auth';

export function POST() {
  try {
    // Clear the session cookie
    clearSession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}