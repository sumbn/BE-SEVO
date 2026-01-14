"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logging_service_1 = require("./logging.service");
const console_adapter_1 = require("./adapters/console.adapter");
const google_sheets_adapter_1 = require("./adapters/google-sheets.adapter");
const internal_logs_controller_1 = require("./internal-logs.controller");
let LoggingModule = class LoggingModule {
};
exports.LoggingModule = LoggingModule;
exports.LoggingModule = LoggingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [internal_logs_controller_1.InternalLogsController],
        providers: [
            {
                provide: logging_service_1.LOGGER_ADAPTER,
                useFactory: (configService) => {
                    const hasGoogleSheets = configService.get('GOOGLE_SHEETS_SPREADSHEET_ID') &&
                        configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') &&
                        configService.get('GOOGLE_PRIVATE_KEY');
                    if (hasGoogleSheets) {
                        return new google_sheets_adapter_1.GoogleSheetsAdapter(configService);
                    }
                    return new console_adapter_1.ConsoleAdapter();
                },
                inject: [config_1.ConfigService],
            },
            logging_service_1.LoggingService,
        ],
        exports: [logging_service_1.LoggingService],
    })
], LoggingModule);
//# sourceMappingURL=logging.module.js.map