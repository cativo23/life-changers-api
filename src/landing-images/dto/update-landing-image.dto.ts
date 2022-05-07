import { PartialType } from '@nestjs/mapped-types';
import { CreateLandingImageDto } from './create-landing-image.dto';

export class UpdateLandingImageDto extends PartialType(CreateLandingImageDto) {}
