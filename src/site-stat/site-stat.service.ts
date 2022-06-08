import { Injectable } from '@nestjs/common';
import { Prisma, SiteStats } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSiteStatDto } from './dto/create-site-stat.dto';
import { UpdateSiteStatDto } from './dto/update-site-stat.dto';

@Injectable()
export class SiteStatService {
  constructor(private prisma: PrismaService) {}

  async create(createSiteStatDto: CreateSiteStatDto, filePath: string) {
    return await this.prisma.siteStats.create({
      data: {
        ...createSiteStatDto,
        image: filePath,
      },
    });
  }

  async findAll(page: number, perPage: number) {
    const paginate = createPaginator({ perPage: perPage });

    return await paginate<SiteStats, Prisma.SiteStatsFindManyArgs>(
      this.prisma.siteStats,
      {
        orderBy: {
          id: 'desc',
        },
      },
      { page: page },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} siteStat`;
  }

  update(id: number, updateSiteStatDto: UpdateSiteStatDto) {
    return `This action updates a #${id} siteStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} siteStat`;
  }
}
