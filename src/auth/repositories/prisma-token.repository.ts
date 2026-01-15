import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITokenRepository } from '../interfaces/token-repository.interface';
import { RefreshToken, User } from '@prisma/client';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { token: string; userId: string; expiresAt: Date }) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findUnique(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    }) as Promise<(RefreshToken & { user: User }) | null>;
  }

  async update(id: string, data: { isRevoked: boolean }) {
    return this.prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  async deleteExpired() {
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
