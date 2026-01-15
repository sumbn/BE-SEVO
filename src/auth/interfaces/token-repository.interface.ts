import { RefreshToken, User } from '@prisma/client';

export interface ITokenRepository {
  create(data: { token: string; userId: string; expiresAt: Date }): Promise<RefreshToken>;
  findUnique(token: string): Promise<(RefreshToken & { user: User }) | null>;
  update(id: string, data: { isRevoked: boolean }): Promise<RefreshToken>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

export const TOKEN_REPOSITORY = 'ITokenRepository';
