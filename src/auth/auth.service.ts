import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    
    constructor(private prisma: PrismaService) {}

    login(){
        return { msg: 'login'};
    }

    async register(dto: AuthDto){
        const hash = await argon.hash(dto.password);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hash,
                username: dto.username
            }
        });

        return user;
    }
}