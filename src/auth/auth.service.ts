import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { ITokenRepository } from './interfaces/token-repository.interface';
import { TOKEN_REPOSITORY } from './interfaces/token-repository.interface';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(TOKEN_REPOSITORY) private tokenRepo: ITokenRepository,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Using transaction to ensure both User and Credential are created
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
        },
      });

      await tx.userCredential.create({
        data: {
          userId: user.id,
          passwordHash: hashedPassword,
          provider: 'local',
        },
      });

      // Assign default 'USER' role if it exists
      const role = await tx.role.findUnique({ where: { name: 'USER' } });
      if (role) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return user;
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        credentials: {
          where: { provider: 'local' },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (user && user.credentials[0]?.passwordHash && await bcrypt.compare(pass, user.credentials[0].passwordHash)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { credentials, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const roles = user.roles?.map((ur: any) => ur.role.name) || [];
    
    const accessToken = this.jwtService.sign({ 
      email: user.email, 
      sub: user.id, 
      roles: roles
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.tokenRepo.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: roles,
      },
    };
  }

  async refreshTokens(oldRefreshToken: string) {
    const savedToken = await this.tokenRepo.findUnique(oldRefreshToken);

    if (!savedToken || savedToken.isRevoked || savedToken.expiresAt < new Date()) {
      if (savedToken) {
        await this.tokenRepo.revokeAllForUser(savedToken.userId);
      }
      throw new UnauthorizedException('AUTH_UNAUTHORIZED');
    }

    await this.tokenRepo.update(savedToken.id, { isRevoked: true });

    // Re-fetch user with roles for login
    const user = await this.prisma.user.findUnique({
      where: { id: savedToken.userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return this.login(user);
  }

  async logout(refreshToken: string) {
    const savedToken = await this.tokenRepo.findUnique(refreshToken);
    if (savedToken) {
      await this.tokenRepo.update(savedToken.id, { isRevoked: true });
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('NOT_FOUND');
    }

    const roles = user.roles.map(ur => ur.role.name);
    const permissions = Array.from(new Set(
      user.roles.flatMap(ur => ur.role.permissions.map(rp => rp.permission.code))
    ));

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roles,
        permissions,
        createdAt: user.createdAt,
      },
    };
  }
}
