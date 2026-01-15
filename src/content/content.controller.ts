import { Controller, Get, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { I18nLang } from 'nestjs-i18n';
// Role enum removed from Prisma since we moved to 3NF model-based roles

import { UpdateContentDto } from './dto/content.dto';
import { LocaleQueryDto } from './dto/locale.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  async findAll(@I18nLang() lang: string) {
    return this.contentService.findAll(lang as any);
  }

  @Get(':key')
  async getByKey(
    @Param('key') key: string,
    @I18nLang() lang: string,
  ) {
    return this.contentService.findByKey(key, lang as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CONTENT_MANAGER')
  @Put(':key')
  async update(@Param('key') key: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.upsert(key, updateContentDto.value);
  }
}
