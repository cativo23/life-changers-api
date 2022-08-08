import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class HomeController {
  constructor(private config: ConfigService) {}

  @Get('/')
  login() {
    return {
      message: 'Welcome to ' + this.config.get('APP_NAME'),
      data:
      {
        'life-changers-api': 'v1.0.0',
        description: 'This is the life changers API',
        author: 'Carlos Cativo <cativo23.kt@gmail.com>',
        urls: [{ docs: 'http://localhost:3333/docs' }],
      }
    }
  }
}
