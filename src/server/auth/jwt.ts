import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'CONTENT_MANAGER' | 'ADMIN';
  fullName: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'eb_jwt_access_secret_production_2026_super_secure_key';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'eb_jwt_refresh_secret_production_2026_super_secure_key';

export const ACCESS_TOKEN_EXPIRY = '1h';
export const REFRESH_TOKEN_EXPIRY = '7d';

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
