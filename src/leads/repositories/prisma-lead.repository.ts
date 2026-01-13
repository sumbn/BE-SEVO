import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ILeadRepository } from '../interfaces/lead-repository.interface';
import { Lead } from '@prisma/client';

@Injectable()
export class PrismaLeadRepository implements ILeadRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    return this.prisma.lead.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.lead.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.lead.update({
      where: { id },
      data,
    });
  }
}
