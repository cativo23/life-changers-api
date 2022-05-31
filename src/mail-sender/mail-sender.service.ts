import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mail from 'nodemailer/lib/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailSenderService {
  private transporter: Mail;

  private logger = new Logger('MailSenderService');
  mailSenderService: any;
  socials: string;

  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
    private mailerService: MailerService,
  ) {
    const socials = [
      ['GitHub', '__Project_GitHub_URL__'],
    ];

    this.socials = socials.map(
      (social) => `<a href="${social[1]}" style="box-sizing:border-box;color:${'#123456'};font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">${social[0]}</a>`,
    ).join('');
  }

  async sendVerifyEmailMail(name: string, email: string, token: string): Promise<boolean> {
    const buttonLink = `${this.config.get('APP_URL')}/auth/verify?token=${token}`;

    const subject = `Welcome to ${this.config.get('APP_NAME')} ${name}! Confirm Your Email`;

    return await this.sendMail(email, name, subject, 'confirm-mail', buttonLink);
  }


  sendMail(email: string, name: string, subject: string, template: string, buttonLink: string): boolean | PromiseLike<boolean> {
    const mailOptions = {
      to: email,
      from: `"${this.config.get('MAIL_FROM_NAME')}" <${this.config.get('MAIL_FROM')}>`,
      subject: subject,
      template: template,
      context: {
        person_name: name,
        proyect_name: this.config.get('APP_NAME'),
        proyect_address: this.config.get('PROJECT_ADDRESS'),
        proyect_logo: this.config.get('PROJECT_LOGO'),
        proyect_slogan: this.config.get('PROJECT_SLOGAN'),
        proyect_color: this.config.get('PROJECT_COLOR'),
        proyect_link: this.config.get('FRONTEND_URL'),
        socials: this.socials,
        button_link: buttonLink,
        terms_of_service_link: this.config.get('FRONTEND_URL') + '/terms-of-service'
      },
    };

    return this.mailerService.sendMail(mailOptions).catch(async (error: any) => {
      if (error) {
        this.logger.warn('Mail sending failed, check your service credentials.');
        this.logger.error(error);
        return false;
      }
      return true;
    });
  }

  async sendResetPasswordMail(
    name: string,
    email: string,
    token: string,
  ): Promise<boolean> {
    const url = this.config.get('APP_URL') + this.config.get('REST_PASS_PATH');

    const buttonLink = `${url}?token=${token}`;

    const subject = `Reset Your ${this.config.get('APP_NAME')} Account's Password`;

    return this.sendMail(email, name, subject, 'reset-password', buttonLink);
  }

  async sendPasswordChangeInfoMail(
    name: string,
    email: string,
  ): Promise<boolean> {
    const buttonLink = this.config.get('APP_URL');

    const subject = `Your ${this.config.get('APP_NAME')} Account's Password has Changed`;

    return this.sendMail(email, name, subject , 'change-password-info', buttonLink);
  }
}
