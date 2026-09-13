import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plainText: string): Promise<string> {
  if (!plainText || plainText.length < 6) {
    throw new Error('كلمة المرور يجب ألا تقل عن 6 أحرف');
  }
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export function hashPasswordSync(plainText: string): string {
  return bcrypt.hashSync(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  if (!plainText || !hash) return false;
  return bcrypt.compare(plainText, hash);
}
