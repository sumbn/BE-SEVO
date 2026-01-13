import type { ILeadRepository } from './interfaces/lead-repository.interface';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
export declare class LeadsService {
    private leadRepo;
    constructor(leadRepo: ILeadRepository);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        parentName: string;
        phone: string;
        studentName: string | null;
        studentAge: number | null;
        courseId: string | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        parentName: string;
        phone: string;
        studentName: string | null;
        studentAge: number | null;
        courseId: string | null;
    }>;
    create(data: CreateLeadDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        parentName: string;
        phone: string;
        studentName: string | null;
        studentAge: number | null;
        courseId: string | null;
    }>;
    updateStatus(id: string, updateDto: UpdateLeadStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        parentName: string;
        phone: string;
        studentName: string | null;
        studentAge: number | null;
        courseId: string | null;
    }>;
}
