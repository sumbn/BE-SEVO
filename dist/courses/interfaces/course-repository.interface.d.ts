import { Course, CourseStatus } from '@prisma/client';
export interface ICourseRepository {
    findAll(filters?: {
        status?: CourseStatus;
    }): Promise<Course[]>;
    findBySlug(slug: string): Promise<Course | null>;
    findById(id: string): Promise<Course | null>;
    create(data: any): Promise<Course>;
    update(id: string, data: any): Promise<Course>;
    delete(id: string): Promise<Course>;
}
export declare const COURSE_REPOSITORY = "ICourseRepository";
