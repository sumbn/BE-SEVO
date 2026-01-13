"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const course_repository_interface_1 = require("./interfaces/course-repository.interface");
const client_1 = require("@prisma/client");
let CoursesService = class CoursesService {
    courseRepo;
    constructor(courseRepo) {
        this.courseRepo = courseRepo;
    }
    async findAll() {
        return this.courseRepo.findAll();
    }
    async findPublished() {
        return this.courseRepo.findAll({ status: client_1.CourseStatus.PUBLISHED });
    }
    async findBySlug(slug) {
        const course = await this.courseRepo.findBySlug(slug);
        if (!course) {
            throw new common_1.NotFoundException(`Course with slug ${slug} not found`);
        }
        return course;
    }
    async create(data) {
        const existing = await this.courseRepo.findBySlug(data.slug);
        if (existing) {
            throw new common_1.ConflictException('Course slug already exists');
        }
        return this.courseRepo.create(data);
    }
    async update(id, data) {
        const course = await this.courseRepo.findById(id);
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        if (data.slug && data.slug !== course.slug) {
            const existing = await this.courseRepo.findBySlug(data.slug);
            if (existing) {
                throw new common_1.ConflictException('New course slug already exists');
            }
        }
        return this.courseRepo.update(id, data);
    }
    async delete(id) {
        const course = await this.courseRepo.findById(id);
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return this.courseRepo.delete(id);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(course_repository_interface_1.COURSE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CoursesService);
//# sourceMappingURL=courses.service.js.map