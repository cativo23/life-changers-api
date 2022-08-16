import { Module } from '@nestjs/common';
import { DocumentImageService } from './document-image.service';
import { DocumentImageController } from './document-image.controller';

@Module({
  controllers: [DocumentImageController],
  providers: [DocumentImageService]
})
export class DocumentImageModule {}
