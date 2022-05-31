import { IsString } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  name: string;
  @IsString()
  position: string;
}
