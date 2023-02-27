import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
@Injectable()
export class AppService {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async login(data: any) {
    console.log('login', data);
    const res = await this.authService.validateUser(
      data.user,
      data.password,
      data.email,
    );
    console.log('respuesta', res);
    return res;
  }
}
