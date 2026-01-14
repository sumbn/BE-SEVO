import { Controller, Get, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateContentDto } from './dto/content.dto';
import { LocaleQueryDto } from './dto/locale.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  async findAll(@Query() query: LocaleQueryDto) {
    return this.contentService.findAll(query.locale as any);
  }

  @Get(':key')
  async getByKey(
    @Param('key') key: string,
    @Query() query: LocaleQueryDto,
  ) {
    return this.contentService.findByKey(key, query.locale as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Put(':key')
  async update(@Param('key') key: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.upsert(key, updateContentDto.value);
  }
}
