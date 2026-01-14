export declare const SUPPORTED_LOCALES: readonly ["en", "vi"];
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export declare const DEFAULT_LOCALE: SupportedLocale;
export declare function isSupportedLocale(locale: string): locale is SupportedLocale;
