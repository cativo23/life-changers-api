import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaxDocumentImage, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDocumentImageDto } from './dto/update-document-image.dto';

@Injectable()
export class DocumentImageService {
  constructor(private prisma: PrismaService) {}
  
  async create(images: Array<Express.Multer.File>, user: User): Promise<any> {
    let savedImages = [];
    let taxImages = [];
    let idImages = [];

    await this.validateUserHasNoDocuments(user);

    images.forEach(async image => {
      switch (image.fieldname.split('_')[0]) {
        case 'tax':
          taxImages.push(image);
          break;
        case 'id':
          idImages.push(image);
      }
    });

    savedImages.push(await this.saveImage(taxImages, user, 'tax'));
    savedImages.push(await this.saveImage(idImages, user, 'id'));

    return savedImages;
  }

  private async validateUserHasNoDocuments(user: User) {
    const userTaxDocuments = await this.prisma.taxDocumentImage.findMany({
      where: {
        userId: user.id,
      },
    });

    if (userTaxDocuments.length > 0) {
      throw new HttpException('User already has tax documents', HttpStatus.BAD_REQUEST);
    }

    const userIdDocuments = await this.prisma.idDocumentImage.findMany({
      where: {
        userId: user.id,
      },
    });

    if (userIdDocuments.length > 0) {
      throw new HttpException('User already has id documents', HttpStatus.BAD_REQUEST);
    }
  }


  private async saveImage(images: Array<Express.Multer.File>, user: User, type: String): Promise<TaxDocumentImage> {
    switch (type) {
      case 'tax':
        return await this.prisma.taxDocumentImage.create({
          data: {
            front: images.filter(image => image.fieldname.split('_')[1] === 'front')[0].path,
            back: images.filter(image => image.fieldname.split('_')[1] === 'back')[0].path,
            user: {
              connect: {
                id: user.id,
              },
            },
          }
        });
      case 'id':
        return await this.prisma.idDocumentImage.create({
          data: {
            front: images.filter(image => image.fieldname.split('_')[1] === 'front')[0].path,
            back: images.filter(image => image.fieldname.split('_')[1] === 'back')[0].path,
            user: {
              connect: {
                id: user.id,
              },
            },
          }
        });
        break;
    }
  }

  findAll() {
    return `This action returns all documentImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentImage`;
  }

  update(id: number, updateDocumentImageDto: UpdateDocumentImageDto) {
    return `This action updates a #${id} documentImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentImage`;
  }
}
