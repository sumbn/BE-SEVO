import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
    findAllAdmin(): Promise<{
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
    findOne(slug: string): Promise<{
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
    create(createCourseDto: CreateCourseDto): Promise<{
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
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<{
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
    remove(id: string): Promise<{
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
