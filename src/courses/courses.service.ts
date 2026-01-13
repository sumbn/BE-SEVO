import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import type { ICourseRepository } from './interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from './interfaces/course-repository.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_REPOSITORY) private courseRepo: ICourseRepository,
  ) {}

  async findAll() {
    return this.courseRepo.findAll();
  }

  async findPublished() {
    return this.courseRepo.findAll({ status: CourseStatus.PUBLISHED });
  }

  async findBySlug(slug: string) {
    const course = await this.courseRepo.findBySlug(slug);
    if (!course) {
      throw new NotFoundException(`Course with slug ${slug} not found`);
    }
    return course;
  }

  async create(data: CreateCourseDto) {
    const existing = await this.courseRepo.findBySlug(data.slug);
    if (existing) {
      throw new ConflictException('Course slug already exists');
    }
    return this.courseRepo.create(data);
  }

  async update(id: string, data: UpdateCourseDto) {
    const course = await this.courseRepo.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (data.slug && data.slug !== course.slug) {
      const existing = await this.courseRepo.findBySlug(data.slug);
      if (existing) {
        throw new ConflictException('New course slug already exists');
      }
    }

    return this.courseRepo.update(id, data);
  }

  async delete(id: string) {
    const course = await this.courseRepo.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.courseRepo.delete(id);
  }
}
