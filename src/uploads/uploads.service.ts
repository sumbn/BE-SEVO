import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadsRoot = path.join(process.cwd(), 'uploads');

  constructor(private cloudinaryService: CloudinaryService) {
    this.ensureDirectoryExists(this.uploadsRoot);
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<{ url: string; key: string }> {
    try {
      this.logger.log(`Uploading file to Cloudinary in folder: ${folder}`);
      const result = await this.cloudinaryService.uploadFile(file, folder);
      
      return {
        url: result.secure_url,
        key: result.public_id,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    // Check if it's a Cloudinary public ID (doesn't contain path separators like backslashes, or specifically ours)
    if (key.includes('project-sevo/')) {
      try {
        await this.cloudinaryService.deleteFile(key);
        this.logger.log(`Deleted file from Cloudinary: ${key}`);
      } catch (error) {
        this.logger.error(`Failed to delete file from Cloudinary: ${error.message}`);
      }
      return;
    }

    // Fallback to local deletion for legacy files
    const filePath = path.join(this.uploadsRoot, key);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        this.logger.log(`Deleted local legacy file: ${key}`);
      } catch (error) {
        this.logger.error(`Failed to delete local file: ${error.message}`);
      }
    }
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
