import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || ''
);

export async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return false;
    }

    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return false;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return !!payload;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export async function createToken(username: string): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error('Admin credentials not properly configured');
    return false;
  }

  return username === validUsername && password === validPassword;
}