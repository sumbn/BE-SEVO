import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaCourseRepository } from './repositories/prisma-course.repository';
import { COURSE_REPOSITORY } from './interfaces/course-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    {
      provide: COURSE_REPOSITORY,
      useClass: PrismaCourseRepository,
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
