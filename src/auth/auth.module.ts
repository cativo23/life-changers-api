import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    JwtModule.register({}),
    MailSenderModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService
  ],
})
export class AuthModule {}
