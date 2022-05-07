import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLandingImageDto } from './dto/create-landing-image.dto';
import { UpdateLandingImageDto } from './dto/update-landing-image.dto';
import * as fs from 'fs';

@Injectable()
export class LandingImagesService {
  constructor(private prisma: PrismaService) {}

  async create(createLandingImageDto: CreateLandingImageDto, filePath: string) {
    const landingImage = await this.prisma.landingImages.create({
      data: {
        name: createLandingImageDto.name,
        alt_name: createLandingImageDto.alt_name,
        image: filePath,
      }
    });

    return landingImage;
  }

  findAll() {
    return this.prisma.landingImages.findMany();
  }

  findOne(id: number) {
    return this.prisma.landingImages.findFirst({
      where: {
        id: +id,
      }
    });
  }

  async update(id: number, updateLandingImageDto: UpdateLandingImageDto, file) {
    const previous = await this.prisma.landingImages.findFirst({
      where: {
        id: +id,
      }
    });

    if(file) {
      this.deleteImage(previous.image);
    }

    return this.prisma.landingImages.update({
      where: {
        id: +id,
      },
      data: {
        name: updateLandingImageDto.name,
        alt_name: updateLandingImageDto.alt_name,
        image: file ? file.path : previous.image,
      },
    });
  }

  async remove(id: number) {
    try {
      const previous = await this.prisma.landingImages.findFirst({
        where: {
          id: +id,
        }
      });

      this.deleteImage(previous.image);

      return await this.prisma.landingImages.delete({
        where: {
          id: +id,
        }
      })
    } catch(err) {
      throw new HttpException('File not found', 404);
    }
  }

  deleteImage(path: string) {
      try {
        fs.unlinkSync(path);
        //file removed
      } catch(err) {
        throw new HttpException('File not found', 404);
      }
  }
}
