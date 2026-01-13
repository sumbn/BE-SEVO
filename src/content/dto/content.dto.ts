import { IsObject, IsNotEmpty } from 'class-validator';

export class UpdateContentDto {
  @IsObject()
  @IsNotEmpty()
  value: any;
}
