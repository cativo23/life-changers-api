import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeController } from './home/home.controller';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [HomeController],
})
export class AppModule {}
