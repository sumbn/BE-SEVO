import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@prisma/client';
import type { ITokenRepository } from './interfaces/token-repository.interface';
import { TOKEN_REPOSITORY } from './interfaces/token-repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(TOKEN_REPOSITORY) private tokenRepo: ITokenRepository,
  ) {}

  async register(data: { email: string; password: string; name?: string; role?: Role }) {
    const existing = await this.prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.admin.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const accessToken = this.jwtService.sign({ 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.tokenRepo.create({
      token: refreshToken,
      adminId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(oldRefreshToken: string) {
    const savedToken = await this.tokenRepo.findUnique(oldRefreshToken);

    if (!savedToken || savedToken.isRevoked || savedToken.expiresAt < new Date()) {
      if (savedToken) {
        // Reuse detection: if token is revoked, revoke all tokens for this user
        await this.tokenRepo.revokeAllForUser(savedToken.adminId);
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Mark old token as revoked (rotation)
    await this.tokenRepo.update(savedToken.id, { isRevoked: true });

    // Generate new pair
    return this.login(savedToken.admin);
  }

  async logout(refreshToken: string) {
    const savedToken = await this.tokenRepo.findUnique(refreshToken);
    if (savedToken) {
      await this.tokenRepo.update(savedToken.id, { isRevoked: true });
    }
  }
}
