import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UserResponse } from './dto';

@UseGuards(JwtGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@GetUser() user: User) {
    return UserResponse.fromUserEntity(user);
  }
}
