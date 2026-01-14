"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLocale = extractLocale;
const locale_constants_1 = require("../constants/locale.constants");
function extractLocale(value, locale, fallbackLocale = locale_constants_1.DEFAULT_LOCALE) {
    if (value == null) {
        return value;
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
        return value;
    }
    const hasLocaleStructure = 'en' in value || 'vi' in value;
    if (!hasLocaleStructure) {
        return value;
    }
    if (value[locale]) {
        return value[locale];
    }
    if (value[fallbackLocale]) {
        return value[fallbackLocale];
    }
    const firstLocale = value['en'] || value['vi'];
    if (firstLocale) {
        return firstLocale;
    }
    return value;
}
//# sourceMappingURL=locale.util.js.map