import { HttpException, Injectable } from '@nestjs/common';
import { Institution, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import * as fs from 'fs';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class InstitutionsService {
  constructor(
    private prisma: PrismaService,
) {}

  async create(createInstitutionDto: CreateInstitutionDto, filePath: string): Promise<Institution> {

    const newInstitution = await this.prisma.institution.create({
      data: {
        name: createInstitutionDto.name,
        description: createInstitutionDto.description,
        email: createInstitutionDto.email,
        phone: createInstitutionDto.phone,
        address: createInstitutionDto.address,
        number_students: Number(createInstitutionDto.number_students),
        adminId: Number(createInstitutionDto.adminId),
        image: filePath,
      }
    });

    return newInstitution;
  }

  async findAll(page: number, perPage: number){
    const paginate = createPaginator({ perPage: perPage });
    
    return await paginate<Institution, Prisma.InstitutionFindManyArgs>(
      this.prisma.institution,
      {
        orderBy: {
          id: 'desc',
        }
      },
      { page: page}
    );
  }

  async findOne(institutionUniqueInput: Prisma.InstitutionWhereUniqueInput): Promise<Institution | null> {
    return await this.prisma.institution.findUnique({
      where: institutionUniqueInput,
    });
  }

  update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    return `This action updates a #${id} institution`;
  }

  async remove(id: number) {
    try {
      const previous = await this.prisma.institution.findFirst({
        where: {
          id: +id,
        }
      });
      
      this.deleteImage(previous.image);

      return await this.prisma.institution.delete({
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
