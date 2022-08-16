import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ApiController } from '../common/controllers/api.controller';
import { DocumentImageService } from './document-image.service';
import { CreateDocumentImageDto } from './dto/create-document-image.dto';
import { UpdateDocumentImageDto } from './dto/update-document-image.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { destinationPath, editFileName, imageFileFilter } from '../utils/file-uploading.utils';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller({
  path: 'client/documents-images',
  version: '1',
})
export class DocumentImageController extends ApiController {
  constructor(private readonly documentImageService: DocumentImageService) {
    super();
  }

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: destinationPath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @UseGuards(JwtGuard)
  async create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() fileDto: CreateDocumentImageDto,
    @GetUser() user: User
  ) {
    try {
      const savedImages = await this.documentImageService.create(images, user);
      return this.successResponse(
        savedImages,
        'Document image created successfully'
      );
    } catch (error) {
      return this.errorResponse(error, 'Document image creation failed');
    }
  }

  @Get()
  findAll() {
    return this.documentImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentImageDto: UpdateDocumentImageDto) {
    return this.documentImageService.update(+id, updateDocumentImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentImageService.remove(+id);
  }
}
