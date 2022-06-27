import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HomeController {
  @Get('/')
  login() {
    return {
      message: 'Welcome to the API',
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
