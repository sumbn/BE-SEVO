import { PrismaService } from '../../prisma/prisma.service';
import { ITokenRepository } from '../interfaces/token-repository.interface';
import { Admin } from '@prisma/client';
export declare class PrismaTokenRepository implements ITokenRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        token: string;
        adminId: string;
        expiresAt: Date;
    }): Promise<{
        id: string;
        token: string;
        adminId: string;
        isRevoked: boolean;
        expiresAt: Date;
        createdAt: Date;
    }>;
    findUnique(token: string): Promise<({
        id: string;
        token: string;
        adminId: string;
        isRevoked: boolean;
        expiresAt: Date;
        createdAt: Date;
    } & {
        admin: Admin;
    }) | null>;
    update(id: string, data: {
        isRevoked: boolean;
    }): Promise<{
        id: string;
        token: string;
        adminId: string;
        isRevoked: boolean;
        expiresAt: Date;
        createdAt: Date;
    }>;
    revokeAllForUser(adminId: string): Promise<void>;
    deleteExpired(): Promise<void>;
}
