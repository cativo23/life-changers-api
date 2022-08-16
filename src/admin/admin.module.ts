import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService, UserService],
  })
export class AdminModule {}
