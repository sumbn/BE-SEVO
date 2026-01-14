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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleQueryDto = void 0;
const class_validator_1 = require("class-validator");
const locale_constants_1 = require("../../common/constants/locale.constants");
class LocaleQueryDto {
    locale = locale_constants_1.DEFAULT_LOCALE;
}
exports.LocaleQueryDto = LocaleQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(locale_constants_1.SUPPORTED_LOCALES, {
        message: `locale must be one of: ${locale_constants_1.SUPPORTED_LOCALES.join(', ')}`,
    }),
    __metadata("design:type", String)
], LocaleQueryDto.prototype, "locale", void 0);
//# sourceMappingURL=locale.dto.js.map