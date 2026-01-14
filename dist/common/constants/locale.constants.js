"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LOCALE = exports.SUPPORTED_LOCALES = void 0;
exports.isSupportedLocale = isSupportedLocale;
exports.SUPPORTED_LOCALES = ['en', 'vi'];
exports.DEFAULT_LOCALE = 'vi';
function isSupportedLocale(locale) {
    return exports.SUPPORTED_LOCALES.includes(locale);
}
//# sourceMappingURL=locale.constants.js.map