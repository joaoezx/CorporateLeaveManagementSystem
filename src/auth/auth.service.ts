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
    // Busca o usuário no banco de dados usando o email
    const user = await this.usersService.findByEmail(email);

    // Se o usuário for encontrado e a senha for igual, retorna os dados do usuário (sem a senha)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // Desestrutura para remover a senha do objeto de retorno
      return result;
    }

    throw new UnauthorizedException('Email e/ou senhas invalidos');
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
