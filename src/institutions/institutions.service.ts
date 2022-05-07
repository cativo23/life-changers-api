import { Injectable } from '@nestjs/common';
import { Institution, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    private prisma: PrismaService,
) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {

    const newInstitution = await this.prisma.institution.create({
      data: createInstitutionDto
    });

    return newInstitution;
  }

  async findAll() {
    return await this.prisma.institution.findMany();
  }

  async findOne(institutionUniqueInput: Prisma.InstitutionWhereUniqueInput): Promise<Institution | null> {
    return await this.prisma.institution.findUnique({
      where: institutionUniqueInput,
    });
  }

  update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    return `This action updates a #${id} institution`;
  }

  remove(id: number) {
    return `This action removes a #${id} institution`;
  }
}
