import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreateSiteStatDto {
  @IsString()
  title: string;
  @IsInt()
  @Type(() => Number)
  total: number;
  @IsString()
  description: string;
}
