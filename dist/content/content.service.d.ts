import type { IContentRepository } from './interfaces/content-repository.interface';
export declare class ContentService {
    private contentRepo;
    constructor(contentRepo: IContentRepository);
    findAll(): Promise<{}>;
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
