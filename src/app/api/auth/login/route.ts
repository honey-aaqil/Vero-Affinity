import { NextResponse } from 'next/server';

// Mock user database - in a real app, this would be a proper database
const USERS = {
  'admin': { password: 'stealth2024', role: 'admin' },
  'agent': { password: 'shadow99', role: 'agent' },
  'operator': { password: 'cipher77', role: 'operator' },
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = USERS[username as keyof typeof USERS];
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create a session cookie
    const sessionData = {
      username,
      role: user.role,
      timestamp: Date.now(),
    };

    // In a real app, you'd sign this with a secret
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: { username, role: user.role }
    });

    // Set httpOnly cookie for security
    response.cookies.set('vero-auth', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}