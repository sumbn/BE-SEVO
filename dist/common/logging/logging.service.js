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
exports.LoggingService = exports.LOGGER_ADAPTER = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.LOGGER_ADAPTER = Symbol('LOGGER_ADAPTER');
let LoggingService = class LoggingService {
    adapter;
    configService;
    request;
    env;
    service = 'backend';
    sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'cookie'];
    constructor(adapter, configService, request) {
        this.adapter = adapter;
        this.configService = configService;
        this.request = request;
        this.env = this.configService.get('NODE_ENV', 'development');
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, error, context) {
        const errorContext = error
            ? {
                error_name: error.name,
                error_message: error.message,
                stack: this.env === 'development' ? error.stack : undefined,
                ...context
            }
            : context;
        this.log('error', message, errorContext);
    }
    log(level, message, context) {
        const metadata = this.buildMetadata(context);
        const entry = {
            message,
            metadata,
            timestamp: new Date().toISOString(),
            level,
        };
        this.adapter.write(entry);
    }
    buildMetadata(context) {
        const requestId = this.extractRequestId();
        const sanitizedContext = context
            ? this.sanitize(context)
            : {};
        return {
            env: this.env,
            service: this.service,
            request_id: requestId,
            ...sanitizedContext,
        };
    }
    extractRequestId() {
        return (this.request?.headers?.['x-request-id'] ||
            this.request?.headers?.['x-correlation-id'] ||
            undefined);
    }
    sanitize(obj) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (this.sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
                sanitized[key] = '[REDACTED]';
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitize(value);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(exports.LOGGER_ADAPTER)),
    __param(2, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, Function, Object])
], LoggingService);
//# sourceMappingURL=logging.service.js.map