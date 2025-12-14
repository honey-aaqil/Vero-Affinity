import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from './mongo';
import { User, SessionPayload } from './types';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-session-secret-key-change-in-production'
);

const SESSION_COOKIE_NAME = 'vero_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection<User>('users').findOne({ username });
  
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  // Update last login
  await db.collection<User>('users').updateOne(
    { _id: user._id },
    { $set: { lastLogin: new Date() } }
  );

  // Log the authentication event
  await db.collection('audit_log').insertOne({
    userId: user._id,
    action: 'login',
    timestamp: new Date(),
    details: { username }
  });

  return user;
}

export async function issueSession(user: User) {
  const sessionData: SessionPayload = {
    userId: user._id!.toString(),
    username: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  };

  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_MAX_AGE)
    .sign(SESSION_SECRET);

  const cookieOptions = {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SESSION_MAX_AGE,
    path: '/'
  };

  return { token, cookieOptions };
}

export async function readSession(cookieHeader?: string): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || 
                 (cookieHeader && getCookieFromHeader(cookieHeader, SESSION_COOKIE_NAME));

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as SessionPayload;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

export async function requireUser(request: NextRequest): Promise<User | null> {
  const session = await readSession(request.headers.get('cookie') || undefined);
  
  if (!session) {
    return null;
  }

  const db = await getDb();
  try {
    const user = await db.collection<User>('users').findOne({ 
      _id: new ObjectId(session.userId) 
    });
    return user;
  } catch (error) {
    console.error('Invalid user ID in session:', error);
    return null;
  }
}

export function clearSession() {
  const cookieStore = cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 0,
    path: '/'
  });
}

function getCookieFromHeader(cookieHeader: string, name: string): string | null {
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValueParts.join('=') || null;
    }
  }
  return null;
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}