import { IsEmail, IsNumber, IsString } from "class-validator";
import { UserExistsId } from "../../user/decorator";

export class CreateInstitutionDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    image: string;

    @IsNumber()
    @UserExistsId()
    adminId: number;
}
