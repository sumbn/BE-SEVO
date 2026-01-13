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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const lead_repository_interface_1 = require("./interfaces/lead-repository.interface");
let LeadsService = class LeadsService {
    leadRepo;
    constructor(leadRepo) {
        this.leadRepo = leadRepo;
    }
    async findAll() {
        return this.leadRepo.findAll();
    }
    async findById(id) {
        const lead = await this.leadRepo.findById(id);
        if (!lead) {
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        }
        return lead;
    }
    async create(data) {
        return this.leadRepo.create({
            ...data,
            status: 'new',
        });
    }
    async updateStatus(id, updateDto) {
        const lead = await this.leadRepo.findById(id);
        if (!lead) {
            throw new common_1.NotFoundException(`Lead with ID ${id} not found`);
        }
        return this.leadRepo.update(id, { status: updateDto.status });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(lead_repository_interface_1.LEAD_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], LeadsService);
//# sourceMappingURL=leads.service.js.map