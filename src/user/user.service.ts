import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User, Prisma } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async find(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async count(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<number> {
    return this.prisma.user.count({
      where: userWhereUniqueInput,
    });
  }

  async create(userData: CreateUserDto, emailVerificationToken): Promise<User> {
    try {
      const name = userData.first_name + ' ' + userData.last_name;


      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          pagadito_costumer_id: '1',
          emailVerification: {
            create: {
              token: emailVerificationToken,
              validUntil: moment().add(1, 'days').toISOString(),
            },
          },
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Unique fields are already taken');
        }
      }

      throw error;
    }
  }
}
