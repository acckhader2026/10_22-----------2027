import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../auth/password';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../auth/jwt';
import { db } from '../db/database';

describe('P0 Production - Authentication & Cryptographic Integrity', () => {
  it('should hash passwords using strong bcrypt salt rounds', async () => {
    const plain = 'SecurePassword2026!';
    const hash = await hashPassword(plain);
    expect(hash).toMatch(/^\$2[ab]\$\d+\$/);

    const isMatch = await verifyPassword(plain, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword('IncorrectPassword123!', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('should sign and verify valid JWT access tokens with embedded RBAC claims', () => {
    const payload = {
      userId: 'usr-student-test',
      email: 'student.test@eb.edu.eg',
      role: 'STUDENT' as const,
      fullName: 'طالب اختباري'
    };

    const token = signAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.role).toBe('STUDENT');
    expect(decoded?.email).toBe(payload.email);
  });

  it('should reject invalid, malformed, or forged JWT tokens', () => {
    expect(verifyAccessToken('malformed.token.here')).toBeNull();
    expect(verifyAccessToken('')).toBeNull();
    expect(verifyRefreshToken('invalid-refresh-token')).toBeNull();
  });

  it('should support refresh token lifecycle and invalidation on logout', () => {
    const userId = 'usr-refresh-test';
    const payload = {
      userId,
      email: 'refresh.test@eb.edu.eg',
      role: 'STUDENT' as const,
      fullName: 'مستخدم التحديث'
    };

    const refreshToken = signRefreshToken(payload);
    const savedToken = db.saveRefreshToken(userId, refreshToken);
    expect(savedToken.token).toBe(refreshToken);

    const found = db.findRefreshToken(refreshToken);
    expect(found).toBeDefined();
    expect(found?.user_id).toBe(userId);

    // Invalidate on logout
    db.deleteRefreshToken(refreshToken);
    const foundAfterLogout = db.findRefreshToken(refreshToken);
    expect(foundAfterLogout).toBeUndefined();
  });
});
