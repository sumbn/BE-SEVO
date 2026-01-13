import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaContentRepository } from './repositories/prisma-content.repository';
import { CONTENT_REPOSITORY } from './interfaces/content-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [ContentController],
  providers: [
    ContentService,
    {
      provide: CONTENT_REPOSITORY,
      useClass: PrismaContentRepository,
    },
  ],
})
export class ContentModule {}
