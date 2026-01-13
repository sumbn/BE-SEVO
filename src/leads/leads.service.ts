import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ILeadRepository } from './interfaces/lead-repository.interface';
import { LEAD_REPOSITORY } from './interfaces/lead-repository.interface';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @Inject(LEAD_REPOSITORY) private leadRepo: ILeadRepository,
  ) {}

  async findAll() {
    return this.leadRepo.findAll();
  }

  async findById(id: string) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async create(data: CreateLeadDto) {
    return this.leadRepo.create({
      ...data,
      status: 'new',
    });
  }

  async updateStatus(id: string, updateDto: UpdateLeadStatusDto) {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return this.leadRepo.update(id, { status: updateDto.status });
  }
}
