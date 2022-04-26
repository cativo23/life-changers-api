import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  //@IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @Length(10, 1000)
  @IsNotEmpty()
  message: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
