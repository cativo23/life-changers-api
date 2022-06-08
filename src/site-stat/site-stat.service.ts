import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, SiteStats } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSiteStatDto } from './dto/create-site-stat.dto';
import { UpdateSiteStatDto } from './dto/update-site-stat.dto';
import * as fs from 'fs';

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

  async findOne(id: number) {
    return await this.prisma.siteStats.findFirst({
      where: {
        id: +id,
      },
    });}

  async update(id: number, updateSiteStatDto: UpdateSiteStatDto, file) {
    const previous = await this.prisma.siteStats.findFirst({
      where: {
        id: +id,
      },
    });

    if (file && previous) {
      this.deleteImage(previous.image);
    }


    return this.prisma.siteStats.update({
      where: {
        id: +id,
      },
      data: {
        title: updateSiteStatDto.title,
        total: updateSiteStatDto.total,
        description: updateSiteStatDto.description,
        image: file ? file.path : previous.image,
      },
    });
  }

  async remove(id: number) {
    try {
      const previous = await this.prisma.siteStats.findFirst({
        where: {
          id: +id,
        },
      });

      this.deleteImage(previous.image);

      return await this.prisma.siteStats.delete({
        where: {
          id: +id,
        },
      });
    } catch (err) {
      throw new HttpException('File not found', 404);
    }
  }

  deleteImage(path: string) {
    try {
      fs.unlinkSync(path);
      //file removed
    } catch (err) {
      throw new HttpException('File not found', 404);
    }
  }
}
