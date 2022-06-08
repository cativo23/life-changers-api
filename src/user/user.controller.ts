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
import { ApiController } from '../common/api.controller';

@UseGuards(JwtGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UserController extends ApiController {
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@GetUser() user: User) {
    return this.successResponse(UserResponse.fromUserEntity(user), 'User profile retrieved');
  }
}
