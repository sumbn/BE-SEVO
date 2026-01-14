import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/content.dto';
import { LocaleQueryDto } from './dto/locale.dto';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    findAll(query: LocaleQueryDto): Promise<{}>;
    getByKey(key: string, query: LocaleQueryDto): Promise<{
        value: any;
        createdAt: Date;
        updatedAt: Date;
        key: string;
    } | null>;
    update(key: string, updateContentDto: UpdateContentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
