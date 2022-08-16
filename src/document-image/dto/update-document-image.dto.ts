import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentImageDto } from './create-document-image.dto';

export class UpdateDocumentImageDto extends PartialType(CreateDocumentImageDto) {}
