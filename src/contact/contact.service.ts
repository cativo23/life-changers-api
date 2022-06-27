import { Injectable } from '@nestjs/common';
import { Contact, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) { }

  create(createContactDto: CreateContactDto) {
    const contact = this.prisma.contact.create({
      data: {
        ...createContactDto,
      },
    });

    return contact;
  }

  async findAll(page: number, perPage: number) {
    const paginate = createPaginator({ perPage: perPage });

    return await paginate<Contact, Prisma.ContactFindManyArgs>(
      this.prisma.contact,
      {
        orderBy: {
          id: 'desc',
        },
      },
      { page: page },
    );
  }

  async findOne(
    contactUniqueInput: Prisma.ContactWhereUniqueInput,
  ): Promise<Contact | null> {
    return await this.prisma.contact.findUnique({
      where: contactUniqueInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.contact.delete({
      where: {
        id: +id,
      },
    });

  }
}
