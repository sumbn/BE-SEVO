import { PrismaService } from '../../prisma/prisma.service';
import { ILeadRepository } from '../interfaces/lead-repository.interface';
export declare class PrismaLeadRepository implements ILeadRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: any): Promise<{
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
    } | null>;
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
