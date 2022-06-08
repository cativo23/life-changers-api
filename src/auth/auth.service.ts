import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { ResetPasswordRequest, ChangePasswordRequest } from './dto';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private user: UserService,
    private mailSender: MailSenderService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
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

    const result = await this.revokeAccessToken(user);

    const tokens = await this.signTokens(user);

    await this.saveTokens(user.id, tokens);

    return tokens;
  }

  async register(dto: CreateUserDto): Promise<Tokens> {
    const emailVerificationToken = nanoid();

    const hasedPassword = await argon.hash(dto.password);
    dto.password = hasedPassword;

    const user = await this.user.create(dto, emailVerificationToken);

    await this.mailSender.sendVerifyEmailMail(
      dto.first_name + ' ' + dto.last_name,
      dto.email,
      emailVerificationToken,
    );

    await this.revokeAccessToken(user);

    const tokens = await this.signTokens(user);

    await this.saveTokens(user.id, tokens);

    return tokens;
  }

  async resendVerificationMail(
    name: string,
    email: string,
    userId: number,
  ): Promise<void> {
    // delete old email verification tokens if exist
    const deletePrevEmailVerificationIfExist =
      this.prisma.emailVerificationTokens.deleteMany({
        where: { userId },
      });

    const token = nanoid();

    const createEmailVerification = this.prisma.emailVerificationTokens.create({
      data: {
        userId,
        token,
        validUntil: moment().add(1, 'days').toISOString(),
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailVerificationIfExist,
      createEmailVerification,
    ]);

    await this.mailSender.sendVerifyEmailMail(name, email, token);
  }

  async verifyEmail(token: string): Promise<Boolean> {
    const emailVerification =
      await this.prisma.emailVerificationTokens.findUnique({
        where: { token },
      });

    if (
      emailVerification !== null &&
      emailVerification.validUntil > new Date()
    ) {
      const user = await this.prisma.user.findUnique({
        where: { id: emailVerification.userId },
      });

      if (user !== null) {
        if (user.emailVerified) {
          return false;
        }
      }

      await this.prisma.user.update({
        where: { id: emailVerification.userId },
        data: {
          emailVerified: true,
        },
        select: null,
      });

      return true;
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

    const deletePrevPasswordResetIfExist =
      this.prisma.passwordResetTokens.deleteMany({
        where: { userId: user.id },
      });

    const token = nanoid();

    const createPasswordReset = this.prisma.passwordResetTokens.create({
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
    const passwordReset = await this.prisma.passwordResetTokens.findUnique({
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

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }

  async signTokens(user: User): Promise<Tokens> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    const expiresInAt = this.config.get('JWT_EXPIRATION');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: expiresInAt,
      secret: secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    const expirationDateAt = moment(moment.now())
      .add(expiresInAt.replace('d', ''), 'days')
      .toISOString();

    const expirationDateRt = moment(moment.now())
      .add('7', 'days')
      .toISOString();

    return {
      access_token: {
        token: accessToken,
        expires_at: expirationDateAt,
      },
      refresh_token: {
        token: refreshToken,
        expires_at: expirationDateRt,
      },
    };
  }

  async saveTokens(userId: number, tokens: Tokens) {
    const accessTokenHashed = await argon.hash(tokens.access_token.token);
    const refreshTokenHashed = await argon.hash(tokens.refresh_token.token);

    await this.prisma.accessToken.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        hashed_token: accessTokenHashed,
        name: 'Personal Access Token',
        expires_at: tokens.access_token.expires_at,
        refresh_tokens: {
          create: {
            hashed_token: refreshTokenHashed,
            expires_at: tokens.refresh_token.expires_at,
          },
        },
      },
    });
  }

  async logout(userId: number): Promise<Boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return await this.revokeAccessToken(user);
  }

  async revokeAccessToken(user: User): Promise<Boolean> {
    const accessTokens = await this.prisma.accessToken.findMany({
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        userId: user.id,
        revoked: false,
      },
    });

    if (accessTokens.length === 0) {
      return false;
    }

    const accessToken = accessTokens[0];

    if (accessToken) {
      await this.prisma.accessToken.update({
        where: {
          id: accessToken.id,
        },
        data: {
          revoked: true,
          refresh_tokens: {
            update: {
              revoked: true,
            },
          },
        },
      });
      return true;
    }
    return false;
  }
}
