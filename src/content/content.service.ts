import { Injectable, Inject } from '@nestjs/common';
import type { IContentRepository } from './interfaces/content-repository.interface';
import { CONTENT_REPOSITORY } from './interfaces/content-repository.interface';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_REPOSITORY) private contentRepo: IContentRepository,
  ) {}

  async findAll() {
    const contents = await this.contentRepo.findAll();
    // Convert array to key-value object for frontend ease of use
    return contents.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  }

  async findByKey(key: string) {
    return this.contentRepo.findByKey(key);
  }

  async upsert(key: string, value: any) {
    return this.contentRepo.upsert(key, value);
  }
}
