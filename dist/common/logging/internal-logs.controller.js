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
exports.InternalLogsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const logging_service_1 = require("./logging.service");
class FrontendLogMetaDto {
    correlation_id;
    browser;
    url;
    component;
    user_id;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogMetaDto.prototype, "correlation_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogMetaDto.prototype, "browser", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogMetaDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogMetaDto.prototype, "component", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogMetaDto.prototype, "user_id", void 0);
class FrontendLogEntryDto {
    message;
    level;
    metadata;
    timestamp;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogEntryDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['info', 'warn', 'error']),
    __metadata("design:type", String)
], FrontendLogEntryDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FrontendLogMetaDto),
    __metadata("design:type", FrontendLogMetaDto)
], FrontendLogEntryDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FrontendLogEntryDto.prototype, "timestamp", void 0);
class BatchLogsDto {
    logs;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FrontendLogEntryDto),
    __metadata("design:type", Array)
], BatchLogsDto.prototype, "logs", void 0);
let InternalLogsController = class InternalLogsController {
    loggingService;
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    async receiveLogs(body) {
        const { logs } = body;
        for (const logEntry of logs) {
            const context = {
                source: 'frontend',
                browser: logEntry.metadata.browser,
                url: logEntry.metadata.url,
                component: logEntry.metadata.component,
                user_id: logEntry.metadata.user_id,
                correlation_id: logEntry.metadata.correlation_id,
                original_timestamp: logEntry.timestamp,
            };
            switch (logEntry.level) {
                case 'info':
                    this.loggingService.info(`[FE] ${logEntry.message}`, context);
                    break;
                case 'warn':
                    this.loggingService.warn(`[FE] ${logEntry.message}`, context);
                    break;
                case 'error':
                    this.loggingService.error(`[FE] ${logEntry.message}`, undefined, context);
                    break;
            }
        }
        return { received: logs.length };
    }
};
exports.InternalLogsController = InternalLogsController;
__decorate([
    (0, common_1.Post)('logs'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BatchLogsDto]),
    __metadata("design:returntype", Promise)
], InternalLogsController.prototype, "receiveLogs", null);
exports.InternalLogsController = InternalLogsController = __decorate([
    (0, common_1.Controller)('api/internal'),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], InternalLogsController);
//# sourceMappingURL=internal-logs.controller.js.map