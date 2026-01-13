"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorCode = 'INTERNAL_SERVER_ERROR';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res.message || exception.message;
            errorCode = res.errorCode || this.generateErrorCode(status, message);
        }
        else {
            console.error('Unhandled Exception:', exception);
        }
        response.status(status).json({
            message,
            errorCode,
            statusCode: status,
        });
    }
    generateErrorCode(status, message) {
        if (status === 401)
            return 'AUTH_UNAUTHORIZED';
        if (status === 403)
            return 'AUTH_FORBIDDEN';
        if (status === 404)
            return 'RESOURCE_NOT_FOUND';
        if (status === 400)
            return 'VALIDATION_ERROR';
        if (status === 409)
            return 'CONFLICT_ERROR';
        return 'INTERNAL_SERVER_ERROR';
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map