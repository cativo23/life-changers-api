import { Module } from '@nestjs/common';
import { UserExistsRule } from './decorator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserExistsRule],
})
export class UserModule {}
