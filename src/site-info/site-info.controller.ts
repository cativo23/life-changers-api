import { Controller, Get, Body, Patch } from '@nestjs/common';
import { SiteInfoService } from './site-info.service';
import { UpdateSiteInfoDto } from './dto/update-site-info.dto';
import { ApiController } from 'src/common/controllers/api.controller';

@Controller({
  path: 'site-info',
  version: '1',
})
export class SiteInfoController extends ApiController{
  constructor(private readonly siteInfoService: SiteInfoService) {
    super();
  }

  @Get()
  async findAll() {
    const info = await this.siteInfoService.findOne(1);
    delete info.created_at;
    delete info.updated_at;
    delete info.id;
    return this.successResponse(info, 'Site Information retrieved successfully');
  }

  @Patch()
  async update(@Body() updateSiteInfoDto: UpdateSiteInfoDto) {
    const info = await this.siteInfoService.update(1, updateSiteInfoDto);
    delete info.created_at;
    delete info.updated_at;
    delete info.id;
    return this.successResponse(info, 'Site Information updated successfully');
  }
}
