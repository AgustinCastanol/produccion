import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly loginService: AppService) {}
  @EventPattern('new_login')
  async handleNewLogin(data: any) {
    const res = await this.loginService.login(data);
    return res;
  }
}
