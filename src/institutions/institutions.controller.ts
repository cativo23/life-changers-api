import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Res, HttpException, UseInterceptors, Query } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { destinationPath, editFileName, imageFileFilter } from '../utils/file-uploading.utils';

@Controller({
  path: 'institutions',
  version: '1',
})
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: destinationPath,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  async create(
    @Body() createInstitutionDto: CreateInstitutionDto,
    @UploadedFile() file,
    @Res() response: Response) {
      if(!file) {
        throw new HttpException('File is required', 400);
      }
      
      const created = await this.institutionsService.create(createInstitutionDto, file.path);
      response.status(201).json(created);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    return await this.institutionsService.findAll(page, perPage);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.institutionsService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionsService.update(+id, updateInstitutionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const deleted = await this.institutionsService.remove(+id);
    return response.status(200).json(deleted);
  }
}
