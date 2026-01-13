import type { ICourseRepository } from './interfaces/course-repository.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
export declare class CoursesService {
    private courseRepo;
    constructor(courseRepo: ICourseRepository);
    findAll(): Promise<{
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
    findPublished(): Promise<{
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
    }>;
    create(data: CreateCourseDto): Promise<{
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
    update(id: string, data: UpdateCourseDto): Promise<{
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
