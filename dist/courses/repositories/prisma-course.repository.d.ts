import { PrismaService } from '../../prisma/prisma.service';
import { ICourseRepository } from '../interfaces/course-repository.interface';
import { CourseStatus } from '@prisma/client';
export declare class PrismaCourseRepository implements ICourseRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        status?: CourseStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    } | null>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string | null;
        ageRange: string | null;
        duration: string | null;
        status: import(".prisma/client").$Enums.CourseStatus;
    }>;
}
