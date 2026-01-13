import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICourseRepository } from '../interfaces/course-repository.interface';
import { Course, CourseStatus } from '@prisma/client';

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { status?: CourseStatus }) {
    return this.prisma.course.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
    });
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.course.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
