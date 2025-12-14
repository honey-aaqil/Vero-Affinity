import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyCredentials, issueSession } from '@/lib/server/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { username, password } = loginSchema.parse(body);
    
    // Verify credentials
    const user = await verifyCredentials(username, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Issue session
    const { token, cookieOptions } = await issueSession(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

    // Set the session cookie
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}