import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeController } from './home/home.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { DonationModule } from './donation/donation.module';
import { ContactModule } from './contact/contact.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { MulterModule } from '@nestjs/platform-express';
import { LandingImagesModule } from './landing-images/landing-images.module';
import { ImagesControllerController } from './images-controller/images-controller.controller';
import { SiteInfoModule } from './site-info/site-info.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { SiteStatModule } from './site-stat/site-stat.module';
import { AdminModule } from './admin/admin.module';
import { DocumentImageModule } from './document-image/document-image.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register(),
    DonationModule,
    ContactModule,
    InstitutionsModule,
    LandingImagesModule,
    SiteInfoModule,
    TeamMembersModule,
    MailSenderModule,
    SiteStatModule,
    DocumentImageModule,
  ],
  controllers: [HomeController, ImagesControllerController],
  providers: [],
})
export class AppModule {}
