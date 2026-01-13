import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: CreateLeadDto): Promise<{
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
    findOne(id: string): Promise<{
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
