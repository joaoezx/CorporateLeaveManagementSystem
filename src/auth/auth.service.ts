import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // cria tokens JWT
    private readonly jwtService: JwtService,

    // buscar usuários no banco de dados
    private readonly usersService: UsersService,
  ) {}

  // valida o usuário com base no email e senha fornecidos
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role,
      leaveRequests: user.leaveRequests,
    };
  }

  // login que gera um token de acesso para o usuário
  async login(user: any) {
    // Define o payload do token, que inclui o email e o ID do usuário, além do papel (role)
    const payload = { email: user.email, sub: user.id, role: user.role };

    // Retorna o token gerado
    return {
      access_token: this.jwtService.sign(payload), // O token é gerado e retornado como parte do objeto
    };
  }
}
