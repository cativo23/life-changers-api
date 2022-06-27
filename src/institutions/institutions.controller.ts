import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  HttpException,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  destinationPath,
  editFileName,
  imageFileFilter,
} from '../utils/file-uploading.utils';
import { Request } from 'express';
import { ApiController } from '../common/controllers/api.controller';

@Controller({
  path: 'institutions',
  version: '1',
})
export class InstitutionsController extends ApiController {
  constructor(private readonly institutionsService: InstitutionsService) {
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
    @Body() createInstitutionDto: CreateInstitutionDto,
    @UploadedFile() file,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new HttpException('File is required', 400);
    }

    const created = await this.institutionsService.create(
      createInstitutionDto,
      file.path,
    );

     return this.successResponse(created, 'Institution created successfully');
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    return this.successResponse(
      await this.institutionsService.findAll(page, perPage),
      'Institutions returned successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const institution = await this.institutionsService.findOne({ id: +id });
    
    if (!institution) {
      throw new HttpException('Institution not found', 404);
    }

    return this.successResponse(
      institution,
      'Successfully retrieved institution information',
    );
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
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ) {
    return this.successResponse(
      await this.institutionsService.update(+id, updateInstitutionDto),
      'Institution updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.institutionsService.remove(+id);

    if (!deleted) {
      throw new HttpException('Institution not found', 404);
    }

    return this.successResponse(
      deleted,
      'Institution deleted successfully',
    );
  }
}
