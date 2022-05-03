import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import * as moment from 'moment';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private user: UserService,
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
    const hash = await argon.hash(dto.password);

    dto.password = hash;

    const user = await this.user.create(dto);

    return user;
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
}
