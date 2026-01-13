import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/content.dto';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    findAll(): Promise<{}>;
    getByKey(key: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
    update(key: string, updateContentDto: UpdateContentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
