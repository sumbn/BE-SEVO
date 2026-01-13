import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Matches } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  parentName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0[0-9]{9,10}$/, {
    message: 'Phone number must be a valid Vietnam phone number (starts with 0, 10-11 digits)',
  })
  phone: string;

  @IsString()
  @IsOptional()
  studentName?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  studentAge?: number;

  @IsString()
  @IsOptional()
  courseId?: string;
}

export class UpdateLeadStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string; // e.g., 'new', 'contacted', 'converted', 'closed'
}
