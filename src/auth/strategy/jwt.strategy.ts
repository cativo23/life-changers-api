import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    
    if (!user) {
      return null;
    }

    const accessTokens = await this.prisma.accessToken.findMany({
      take: 1,
      orderBy: {
        created_at: 'desc'
      },
      where: {
        userId: user.id,
      },
    });

    const accessToken = accessTokens[0];

    if (!accessToken) {
      return null;
    } else {
      if (accessToken.revoked) {
        return null;
      }
    }

    delete user.password;
    return user;
  }
}
