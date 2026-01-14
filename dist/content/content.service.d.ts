import type { IContentRepository } from './interfaces/content-repository.interface';
import { SupportedLocale } from '../common/constants/locale.constants';
export declare class ContentService {
    private contentRepo;
    constructor(contentRepo: IContentRepository);
    findAll(locale?: SupportedLocale): Promise<{}>;
    findByKey(key: string, locale?: SupportedLocale): Promise<{
        value: any;
        createdAt: Date;
        updatedAt: Date;
        key: string;
    } | null>;
    upsert(key: string, value: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
