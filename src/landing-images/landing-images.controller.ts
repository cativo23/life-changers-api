import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
  Query,
} from '@nestjs/common';
import { LandingImagesService } from './landing-images.service';
import { CreateLandingImageDto } from './dto/create-landing-image.dto';
import { UpdateLandingImageDto } from './dto/update-landing-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  destinationPath,
  editFileName,
  imageFileFilter,
} from '../utils/file-uploading.utils';
import { Response } from 'express';
import { ApiController } from 'src/common/api.controller';

@Controller({
  path: 'landing-images',
  version: '1',
})
export class LandingImagesController extends ApiController {
  constructor(private readonly landingImagesService: LandingImagesService) {
    super();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destinationPath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile() file,
    @Body() createLandingImageDto: CreateLandingImageDto,
  ) {
    if (!file) {
      throw new HttpException('File is required', 400);
    }
    const created = await this.landingImagesService.create(
      createLandingImageDto,
      file.path,
    );
    return await this.successResponse(
      created,
      'Landing image created successfully',
    );
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    return this.successResponse(
      await this.landingImagesService.findAll(page, perPage),
      'Landing images retrieved successfully',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landingImagesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destinationPath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateLandingImageDto: UpdateLandingImageDto,
    @UploadedFile() file,
  ) {
    return await this.landingImagesService.update(
      +id,
      updateLandingImageDto,
      file,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const deleted = await this.landingImagesService.remove(+id);
    return response.status(200).json(deleted);
  }
}
