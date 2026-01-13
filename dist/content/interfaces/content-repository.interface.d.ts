import { Content } from '@prisma/client';
export interface IContentRepository {
    findAll(): Promise<Content[]>;
    findByKey(key: string): Promise<Content | null>;
    upsert(key: string, value: any): Promise<Content>;
}
export declare const CONTENT_REPOSITORY = "IContentRepository";
