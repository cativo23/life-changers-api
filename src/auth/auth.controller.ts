import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dto';
import { AuthService } from './auth.service';
import { AuthRequest, CheckEmailResponse, CheckEmailRequest } from './dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailAvailability(
    @Body() checkEmailRequest: CheckEmailRequest,
  ): Promise<CheckEmailResponse> {
    const isAvailable = await this.authService.isEmailAvailable(checkEmailRequest.email);
    return new CheckEmailResponse(isAvailable);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthRequest) {
    return this.authService.login(dto);
  }
}
