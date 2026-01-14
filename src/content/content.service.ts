import { Injectable, Inject } from '@nestjs/common';
import type { IContentRepository } from './interfaces/content-repository.interface';
import { CONTENT_REPOSITORY } from './interfaces/content-repository.interface';
import { extractLocale } from '../common/utils/locale.util';
import { SupportedLocale, DEFAULT_LOCALE } from '../common/constants/locale.constants';

@Injectable()
export class ContentService {
  constructor(
    @Inject(CONTENT_REPOSITORY) private contentRepo: IContentRepository,
  ) {}

  async findAll(locale: SupportedLocale = DEFAULT_LOCALE) {
    const contents = await this.contentRepo.findAll();
    // Convert array to key-value object and extract locale-specific data
    return contents.reduce((acc, curr) => {
      const localizedValue = extractLocale(curr.value, locale);
      return { ...acc, [curr.key]: localizedValue };
    }, {});
  }

  async findByKey(key: string, locale: SupportedLocale = DEFAULT_LOCALE) {
    const content = await this.contentRepo.findByKey(key);
    if (!content) {
      return null;
    }

    // Extract locale-specific data from the value
    return {
      ...content,
      value: extractLocale(content.value, locale),
    };
  }

  async upsert(key: string, value: any) {
    return this.contentRepo.upsert(key, value);
  }
}

