import { RefreshToken, Admin } from '@prisma/client';

export interface ITokenRepository {
  create(data: { token: string; adminId: string; expiresAt: Date }): Promise<RefreshToken>;
  findUnique(token: string): Promise<(RefreshToken & { admin: Admin }) | null>;
  update(id: string, data: { isRevoked: boolean }): Promise<RefreshToken>;
  revokeAllForUser(adminId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

export const TOKEN_REPOSITORY = 'ITokenRepository';
