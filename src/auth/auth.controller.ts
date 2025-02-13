import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // Método que recebe os dados de login via @Body (email e password)
  async login(@Body() loginDto: { email: string; password: string }) {
    // método login do AuthService e retorna o resultado token de acesso
    return this.authService.login(loginDto);
  }
}
