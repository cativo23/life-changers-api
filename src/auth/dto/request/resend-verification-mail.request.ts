import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationMailRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
