import { IsString } from 'class-validator';

export class UpdateSiteInfoDto {
  @IsString()
  about_us: string;
  @IsString()
  mission: string;
  @IsString()
  vision: string;
  @IsString()
  values: string;
}
