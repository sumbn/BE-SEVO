import { IsIn, IsOptional, IsString } from 'class-validator';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../../common/constants/locale.constants';

/**
 * DTO for locale query parameter validation
 */
export class LocaleQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LOCALES, {
    message: `locale must be one of: ${SUPPORTED_LOCALES.join(', ')}`,
  })
  locale?: string = DEFAULT_LOCALE;
}
