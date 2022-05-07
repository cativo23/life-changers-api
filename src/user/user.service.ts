import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { CreateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private stripeService: StripeService,
        private prisma: PrismaService,
    ) {}

    async find(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async count(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<number> {
        return this.prisma.user.count({
            where: userWhereUniqueInput,
        });
    }
    
    async create(userData: CreateUserDto) {

        try {
            const name = userData.first_name + ' ' + userData.last_name;

            let stripeCustomer = await this.stripeService.searchCustomer(name, userData.email);

            if  (!stripeCustomer) {
                stripeCustomer = await this.stripeService.createCustomer(name, userData.email);
            }

            const newUser = await this.prisma.user.create({
                data: {
                    ...userData,
                    stripe_costumer_id: stripeCustomer.id
                }
            });

            return newUser;
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already in use');
                }
            }

            if (error.type == 'StripeAuthenticationError') {
                throw new ForbiddenException('Invalid Stripe Credentials');
            }
        }

        
    }
}
