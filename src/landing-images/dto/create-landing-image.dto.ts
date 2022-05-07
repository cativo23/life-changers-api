import { IsString } from "class-validator";

export class CreateLandingImageDto {
    @IsString()
    name: string;
    @IsString()
    alt_name: string;
}
