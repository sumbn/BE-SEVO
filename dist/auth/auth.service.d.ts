import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import type { ITokenRepository } from './interfaces/token-repository.interface';
export declare class AuthService {
    private prisma;
    private jwtService;
    private tokenRepo;
    constructor(prisma: PrismaService, jwtService: JwtService, tokenRepo: ITokenRepository);
    register(data: {
        email: string;
        password: string;
        name?: string;
        role?: Role;
    }): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    refreshTokens(oldRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    logout(refreshToken: string): Promise<void>;
}
