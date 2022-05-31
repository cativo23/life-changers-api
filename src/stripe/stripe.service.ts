import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async getCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  public async searchCustomer(name: string, email: string) {
    const searchQuery = "name:'" + name + "' AND email:'" + email + "'";

    const result = await this.stripe.customers.search({
      query: searchQuery,
    });

    return result.data[0];
  }
}
