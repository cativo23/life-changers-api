import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeController } from './home/home.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { DonationModule } from './donation/donation.module';
import { ContactModule } from './contact/contact.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DonationModule,
    ContactModule,
  ],
  controllers: [HomeController],
})
export class AppModule {}
