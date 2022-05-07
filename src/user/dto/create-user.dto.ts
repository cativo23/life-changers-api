import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserExists } from '../decorator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @UserExists()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}