import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';
import * as argon from 'argon2';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { nanoid } from 'nanoid';
import {
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './dto';
import { MailSenderService } from '../mail-sender/mail-sender.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private user: UserService,
    private mailSender: MailSenderService,
  ) {}

  async login(dto: LoginDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const valid = await argon.verify(user.password, dto.password);

    if (!valid) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user);
  }

  async register(dto: CreateUserDto) {
    const emailVerificationToken = nanoid();

    const hasedPassword = await argon.hash(dto.password);
    dto.password = hasedPassword;
    
    
    const user = await this.user.create(dto, emailVerificationToken);

    await this.mailSender.sendVerifyEmailMail(
      dto.first_name + ' ' + dto.last_name,
      dto.email,
      emailVerificationToken,
    );
      
    return user;
  }

  async resendVerificationMail(
    name: string,
    email: string,
    userId: number,
  ): Promise<void> {
    // delete old email verification tokens if exist
    const deletePrevEmailVerificationIfExist = this.prisma.emailVerification.deleteMany({
      where: { userId },
    });

    const token = nanoid();

    const createEmailVerification = this.prisma.emailVerification.create({
      data: {
        userId,
        token,
        validUntil:  moment().add(1, 'days').toISOString()
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailVerificationIfExist,
      createEmailVerification,
    ]);

    await this.mailSender.sendVerifyEmailMail(name, email, token);
  }

  async verifyEmail(token: string): Promise<void> {
    const emailVerification = await this.prisma.emailVerification.findUnique({
      where: { token },
    });

    if (
      emailVerification !== null
      && emailVerification.validUntil > new Date()
    ) {
      await this.prisma.user.update({
        where: { id: emailVerification.userId },
        data: {
          emailVerified: true,
        },
        select: null,
      });
    } else {
      Logger.log(`Verify email called with invalid email token ${token}`);
      throw new NotFoundException();
    }
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        first_name: true,
        email: true,
      },
    });

    if (user === null) {
      throw new NotFoundException();
    }

    const deletePrevPasswordResetIfExist = this.prisma.passwordReset.deleteMany(
      {
        where: { userId: user.id },
      },
    );

    const token = nanoid();

    const createPasswordReset = this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        validUntil: moment().add(1, 'days').toISOString(),
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevPasswordResetIfExist,
      createPasswordReset,
    ]);

    await this.mailSender.sendResetPasswordMail(
      user.first_name,
      user.email,
      token,
    );
  }

  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token: resetPasswordRequest.token },
    });

    if (passwordReset !== null && passwordReset.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: {
          password: await argon.hash(resetPasswordRequest.newPassword),
        },
        select: null,
      });
    } else {
      Logger.log(
        `Invalid reset password token ${resetPasswordRequest.token} is rejected`,
      );
      throw new NotFoundException();
    }
  }

  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
    userId: number,
    name: string,
    email: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await argon.hash(changePasswordRequest.newPassword),
      },
      select: null,
    });

    // no need to wait for information email
    this.mailSender.sendPasswordChangeInfoMail(name, email);
  }


  async signToken(user: User): Promise<{
    access_token: string;
    expires_at: string;
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.config.get('JWT_SECRET');

    const expiresIn = this.config.get('JWT_EXPIRATION');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });

    const expirationDate = moment(moment.now())
      .add(expiresIn, 'days')
      .format('d/MM/yyyy HH:mm:ss');

    return {
      access_token: token,
      expires_at: expirationDate,
    };
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }
}
