import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HomeController {
    @Get('/')
    login() {
        return {
            "life-changers-api": 'v1.0.0',
            "description": 'This is the life changers API',
            'author': 'Carlos Cativo <cativo23.kt@gmail.com>',
            'urls': [
                {'docs': 'http://localhost:3000/docs'},
            ]
        };
    }
}
