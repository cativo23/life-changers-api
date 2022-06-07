import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
