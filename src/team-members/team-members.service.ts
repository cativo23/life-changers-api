import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, TeamMember } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import * as fs from 'fs';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamMemberDto: CreateTeamMemberDto, filePath: string) {
    const newMember = await this.prisma.teamMember.create({
      data: {
        ...createTeamMemberDto,
        image: filePath
      }
    });

    return newMember;;
  }

  async findAll(page: number, perPage: number) {
    const paginate = createPaginator({ perPage: perPage });
    
    return await paginate<TeamMember, Prisma.TeamMemberFindManyArgs>(
      this.prisma.institution,
      {
        orderBy: {
          id: 'desc',
        }
      },
      { page: page}
    );
  }

  async findOne(memberUniqeInput: Prisma.TeamMemberWhereUniqueInput): Promise<TeamMember | null> {
    return await this.prisma.teamMember.findUnique({
      where: memberUniqeInput,
    });
  }

  async update(id: number, updateTeamMemberDto: UpdateTeamMemberDto) {
    return `This action updates a #${id} teamMember`;
  }

  async remove(id: number) {
    try {
      const previous = await this.prisma.teamMember.findFirst({
        where: {
          id: +id,
        }
      });
      
      this.deleteImage(previous.image);

      return await this.prisma.teamMember.delete({
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
