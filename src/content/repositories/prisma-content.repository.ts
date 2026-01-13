import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IContentRepository } from '../interfaces/content-repository.interface';

@Injectable()
export class PrismaContentRepository implements IContentRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.content.findMany();
  }

  async findByKey(key: string) {
    return this.prisma.content.findUnique({
      where: { key },
    });
  }

  async upsert(key: string, value: any) {
    return this.prisma.content.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
