import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteStatDto } from './create-site-stat.dto';

export class UpdateSiteStatDto extends PartialType(CreateSiteStatDto) {}
