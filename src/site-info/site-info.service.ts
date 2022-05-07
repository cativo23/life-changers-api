import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSiteInfoDto } from './dto/update-site-info.dto';

@Injectable()
export class SiteInfoService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return await this.prisma.siteInfo.findFirst({
      where: {
        id: +id,
      }
    });
  }

  async update(id: number, updateSiteInfoDto: UpdateSiteInfoDto) {
    return await this.prisma.siteInfo.update({
      where: {
        id: +id,
      },
      data: {
        ...updateSiteInfoDto,
      }
    });
  }
}
