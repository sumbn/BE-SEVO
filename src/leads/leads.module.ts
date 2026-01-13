import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaLeadRepository } from './repositories/prisma-lead.repository';
import { LEAD_REPOSITORY } from './interfaces/lead-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController],
  providers: [
    LeadsService,
    {
      provide: LEAD_REPOSITORY,
      useClass: PrismaLeadRepository,
    },
  ],
  exports: [LeadsService],
})
export class LeadsModule {}
