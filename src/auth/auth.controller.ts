import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.login({ email, password });
  }

  @Post('register')
  async addUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.register({
      name,
      surname,
      email,
      password,
    });
    return user;
  }
}
