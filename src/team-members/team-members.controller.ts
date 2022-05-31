import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  destinationPath,
  editFileName,
  imageFileFilter,
} from 'src/utils/file-uploading.utils';
import { Response } from 'express';

@Controller({
  path: 'team-members',
  version: '1',
})
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destinationPath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @UploadedFile() file,
    @Res() response: Response,
  ) {
    const created = await this.teamMembersService.create(
      createTeamMemberDto,
      file.path,
    );
    return response.status(201).json(created);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') perPage: number) {
    return await this.teamMembersService.findAll(page, perPage);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne({ id: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return this.teamMembersService.update(+id, updateTeamMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(+id);
  }
}
