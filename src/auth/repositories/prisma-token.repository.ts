import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITokenRepository } from '../interfaces/token-repository.interface';
import { RefreshToken, Admin } from '@prisma/client';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { token: string; adminId: string; expiresAt: Date }) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findUnique(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { admin: true },
    }) as Promise<(RefreshToken & { admin: Admin }) | null>;
  }

  async update(id: string, data: { isRevoked: boolean }) {
    return this.prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  async revokeAllForUser(adminId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { adminId },
      data: { isRevoked: true },
    });
  }

  async deleteExpired() {
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
