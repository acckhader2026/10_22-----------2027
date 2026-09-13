import { db } from '../database';
import { DbUser, DbRefreshToken, UserRole } from '../schema';

export class UserRepository {
  async findByEmail(email: string): Promise<DbUser | null> {
    const user = db.findUserByEmail(email);
    return user || null;
  }

  async findById(id: string): Promise<DbUser | null> {
    const user = db.findUserById(id);
    return user || null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<DbUser> {
    return db.createUser(data);
  }

  async listAll(roleFilter?: UserRole): Promise<Omit<DbUser, 'password_hash'>[]> {
    return db.users
      .filter(u => !roleFilter || u.role === roleFilter)
      .map(u => {
        const { password_hash, ...rest } = u;
        return rest;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async countByRole(role: UserRole): Promise<number> {
    return db.users.filter(u => u.role === role).length;
  }

  async updateRole(userId: string, newRole: UserRole, adminActorId: string): Promise<DbUser> {
    return db.updateUserRole(userId, newRole, adminActorId);
  }

  // Refresh Token Management
  async saveRefreshToken(userId: string, token: string, expiresInDays: number = 7): Promise<DbRefreshToken> {
    return db.saveRefreshToken(userId, token, expiresInDays);
  }

  async findRefreshToken(token: string): Promise<DbRefreshToken | null> {
    const rt = db.findRefreshToken(token);
    return rt || null;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    db.deleteRefreshToken(token);
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    db.refreshTokens = db.refreshTokens.filter(rt => rt.user_id !== userId);
    db.persist();
  }
}

export const userRepository = new UserRepository();
