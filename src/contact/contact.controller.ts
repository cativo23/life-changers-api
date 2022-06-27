import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
} from '@nestjs/common';
import { ApiController } from '../common/controllers/api.controller';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller({
  path: 'contacts',
  version: '1',
})
export class ContactController extends ApiController {
  constructor(private readonly contactService: ContactService) {
    super();
  }

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.successResponse(
      await this.contactService.create(createContactDto),
      'Contact Information Sent',
    );
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    return this.successResponse(
      await this.contactService.findAll(page, perPage),
      'Contact Information Returned Successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    const contact = await this.contactService.findOne({id: +id});

    if (!contact) {
      throw new HttpException('Contact not found', 404);
    }

    return this.successResponse(
      contact,
      'Successfully retrieved contact information',
    );
  }

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }*/
}
