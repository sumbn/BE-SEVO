import { CloudinaryService } from './cloudinary.service';
export declare class UploadsService {
    private cloudinaryService;
    private readonly logger;
    private readonly uploadsRoot;
    constructor(cloudinaryService: CloudinaryService);
    saveFile(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<void>;
    private ensureDirectoryExists;
}
