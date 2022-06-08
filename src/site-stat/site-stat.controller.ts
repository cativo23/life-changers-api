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
  Res,
  Query,
} from '@nestjs/common';
import { SiteStatService } from './site-stat.service';
import { CreateSiteStatDto } from './dto/create-site-stat.dto';
import { UpdateSiteStatDto } from './dto/update-site-stat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  destinationPath,
  editFileName,
  imageFileFilter,
} from '../utils/file-uploading.utils';
import { ApiController } from '../common/controllers/api.controller';

@Controller({
  path: 'site-stats',
  version: '1',
})
export class SiteStatController extends ApiController {
  constructor(private readonly siteStatService: SiteStatService) {
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
    @Body() createSiteStatDto: CreateSiteStatDto,
    @UploadedFile() file,
  ) {
    const created = await this.siteStatService.create(
      createSiteStatDto,
      file.path,
    );

    return await this.successResponse(
      created,
      'Site stat created successfully',
    );
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    const stats = await this.siteStatService.findAll(page, perPage);

    return this.successResponse(stats, 'Site stats retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.successResponse(
      await this.siteStatService.findOne(+id),
      'Site stat retrieved successfully',
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
    @Body() updateSiteStatDto: UpdateSiteStatDto,
    @UploadedFile() file,
  ) {
    return this.successResponse(
      await this.siteStatService.update(
        +id,
        updateSiteStatDto,
        file,
        ),
      'Site stat updated successfully'
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.successResponse(
      await this.siteStatService.remove(+id),
      'Site stat removed successfully',
    );
  }
}
