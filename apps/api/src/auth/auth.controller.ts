import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.auth.register(dto);
    } catch (e: any) {
      return {
        error: true,
        message: e.message,
        stack: e.stack,
        details: e
      };
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.auth.login(dto);
    } catch (e: any) {
      return {
        error: true,
        message: e.message,
        stack: e.stack,
        details: e
      };
    }
  }
}
