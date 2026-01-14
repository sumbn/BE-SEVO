import { DEFAULT_LOCALE, SupportedLocale } from '../constants/locale.constants';

/**
 * Extract locale-specific data from a multilingual object
 * 
 * @param value - The value to extract from (can be multilingual object or plain value)
 * @param locale - The requested locale
 * @param fallbackLocale - The fallback locale if requested locale is not found
 * @returns The locale-specific data or original value
 * 
 * @example
 * const data = { en: { title: 'Hello' }, vi: { title: 'Xin chào' } };
 * extractLocale(data, 'vi') // Returns { title: 'Xin chào' }
 * extractLocale(data, 'en') // Returns { title: 'Hello' }
 * extractLocale(data, 'fr', 'en') // Returns { title: 'Hello' } (fallback)
 */
export function extractLocale<T = any>(
  value: any,
  locale: SupportedLocale,
  fallbackLocale: SupportedLocale = DEFAULT_LOCALE,
): T {
  // If value is null/undefined, return as is
  if (value == null) {
    return value;
  }

  // If value is not an object, return as is (not multilingual)
  if (typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  // Check if value has locale structure (has 'en' or 'vi' keys)
  const hasLocaleStructure = 'en' in value || 'vi' in value;
  
  if (!hasLocaleStructure) {
    // Not a multilingual object, return as is
    return value;
  }

  // Try to get requested locale
  if (value[locale]) {
    return value[locale];
  }

  // Try fallback locale
  if (value[fallbackLocale]) {
    return value[fallbackLocale];
  }

  // If neither locale nor fallback exists, return first available locale
  const firstLocale = value['en'] || value['vi'];
  if (firstLocale) {
    return firstLocale;
  }

  // Last resort: return original value
  return value;
}
