import { PrismaService } from '../../prisma/prisma.service';
import { IContentRepository } from '../interfaces/content-repository.interface';
export declare class PrismaContentRepository implements IContentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findByKey(key: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
    upsert(key: string, value: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
