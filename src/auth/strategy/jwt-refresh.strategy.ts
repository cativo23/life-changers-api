import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, JwtPayloadWithRt } from '../types';
import { Request } from 'express';
import * as argon from 'argon2';

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayloadWithRt> {

    const token = req?.get('authorization')?.replace('Bearer', '').trim();

    const refreshTokens = await this.prisma.refreshToken.findMany({
      take: 1,
      where: {
        hashed_token: await argon.hash(token),
      }
    });

    if (refreshTokens.length === 0) throw new ForbiddenException('Refresh token malformed');

    const refreshToken = refreshTokens[0];

    if (refreshToken.revoked) {
      return null;
    }
    
    return {
      ...payload,
      'refreshToken': token,
    };
  }
}
