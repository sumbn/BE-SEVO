import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';
import { CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase and contain only alphanumeric characters and hyphens',
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  ageRange?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must be lowercase and contain only alphanumeric characters and hyphens',
  })
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  ageRange?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}
