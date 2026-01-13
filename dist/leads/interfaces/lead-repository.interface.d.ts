import { Lead } from '@prisma/client';
export interface ILeadRepository {
    findAll(filters?: any): Promise<Lead[]>;
    findById(id: string): Promise<Lead | null>;
    create(data: any): Promise<Lead>;
    update(id: string, data: any): Promise<Lead>;
}
export declare const LEAD_REPOSITORY = "ILeadRepository";
