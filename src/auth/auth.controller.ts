import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiController } from 'src/common/api.controller';
import { ApiResponse } from '../common/general-transformer.interceptor';
import { CreateUserDto, UserResponse } from '../user/dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthRequest, CheckEmailResponse, CheckEmailRequest } from './dto';
import { JwtGuard } from './guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController extends ApiController {
  constructor(private authService: AuthService) {
    super();
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ApiResponse)
  async checkEmailAvailability(
    @Body() checkEmailRequest: CheckEmailRequest,
  ): Promise<Object> {
    const isAvailable = await this.authService.isEmailAvailable(
      checkEmailRequest.email,
    );
    return this.successResponse(
      new CheckEmailResponse(isAvailable),
      "Response with email availability"
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ApiResponse)
  async register(@Body() dto: CreateUserDto) {
    return this.successResponse(
      await this.authService.register(dto),
      'Usuario Registrado Correctamente'
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ApiResponse)
  @Post('login')
  async login(@Body() dto: AuthRequest) {
    return this.successResponse(
      await this.authService.login(dto),
      'Login Successful',
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: User) {

    const loggedOut = await this.authService.logout(user.id);

    if(loggedOut){
      return this.successResponse(
        loggedOut,
        'Logout Successful'
      );
    }
    return this.errorResponse(
      loggedOut,
      'Already Logged Out'
    );
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyMail(@Query('token') token: string) {
    const isVerified = await this.authService.verifyEmail(token);

    if(isVerified){
      return this.successResponse(
        isVerified,
        'Email Verified Successfully'
      );
    }
    return this.errorResponse(
      isVerified,
      'Email Already Verified'
    );
  }
}
