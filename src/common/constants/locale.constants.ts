/**
 * Supported locales for the application
 */
export const SUPPORTED_LOCALES = ['en', 'vi'] as const;

/**
 * Type representing a supported locale
 */
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: SupportedLocale = 'vi';

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
