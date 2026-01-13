import { CourseStatus } from '@prisma/client';
export declare class CreateCourseDto {
    title: string;
    slug: string;
    description?: string;
    ageRange?: string;
    duration?: string;
    status?: CourseStatus;
}
export declare class UpdateCourseDto {
    title?: string;
    slug?: string;
    description?: string;
    ageRange?: string;
    duration?: string;
    status?: CourseStatus;
}
