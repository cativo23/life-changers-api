import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { CreateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
    constructor(
        private stripeService: StripeService,
        private prisma: PrismaService,
    ) {}
    
    async create(userData: CreateUserDto) {

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    ...userData
                }
            });
            const name = userData.first_name + ' ' + userData.last_name;
            
            const stripeCustomer = await this.stripeService.createCustomer(name, userData.email);

            await this.prisma.user.update({
                data: {
                    stripe_costumer_id: stripeCustomer.id},
                    where: {id: newUser.id}
                }
            );

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
