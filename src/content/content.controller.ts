import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateContentDto } from './dto/content.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  async findAll() {
    return this.contentService.findAll();
  }

  @Get(':key')
  async getByKey(@Param('key') key: string) {
    return this.contentService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Put(':key')
  async update(@Param('key') key: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.upsert(key, updateContentDto.value);
  }
}
