import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'No authentication found' },
        { status: 401 }
      );
    }

    // Parse the auth cookie
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
      })
    );

    const authCookie = cookies['vero-auth'];
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'No authentication found' },
        { status: 401 }
      );
    }

    try {
      // Decode and validate session
      const sessionData = JSON.parse(Buffer.from(authCookie, 'base64').toString());
      
      // Check if session is not too old (7 days max)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      if (Date.now() - sessionData.timestamp > maxAge) {
        const response = NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
        response.cookies.delete('vero-auth');
        return response;
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          username: sessionData.username,
          role: sessionData.role,
        }
      });
    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}