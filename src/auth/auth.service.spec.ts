import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, // Mock do serviço de usuários
          useValue: {
            findByEmail: jest.fn(), // Mock do método findByEmail
          },
        },
        {
          provide: JwtService, // Mock do serviço de JWT
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'), // Mock do método sign, retornando um token mockado
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // verificando se o usuário é retornado
  it('should validate a user and return user data', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // Criando um usuário mockado com senha criptografada
    const mockUser: User = {
      id: '1',
      email,
      password: await bcrypt.hash(password, 10), // Senha criptografada
      name: 'John Doe',
      department: 'IT',
      role: 'Developer',
      leaveRequests: [],
    };

    // Mock do método findByEmail do UsersService para retornar o usuário mockado
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    // Mock do método compare do bcrypt para validar a senha
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // Chama o método validateUser
    const result = await authService.validateUser(email, password);
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      department: mockUser.department,
      role: mockUser.role,
      leaveRequests: mockUser.leaveRequests,
    });
  });

  //usuário não é encontrado no banco de dados
  it('should throw an error if user is not found', async () => {
    // Mock do findByEmail para retornar null (usuário não encontrado)
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    // Verifica se a exceção é lançada com a mensagem correta
    await expect(
      authService.validateUser('invalidEmail', 'invalidPassword'),
    ).rejects.toThrow('Email e/ou senhas invalidos'); // Mensagem ajustada
  });

  // quando a senha fornecida não corresponde
  it('should throw an error if password is invalid', async () => {
    // Criando um usuário mockado com a senha correta
    const mockUser = {
      id: '1',
      email: 'John.Doe@example.com',
      password: await bcrypt.hash('correctPassword', 10), // Senha criptografada
      name: 'John Doe',
      department: 'IT',
      role: 'Developer',
      leaveRequests: [],
    };

    // Mock do findByEmail para retornar o usuario mockado
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    // Mock do bcrypt.compare para simular falha na comparação da senha
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    // Verifica se a exceção é lançada
    await expect(
      authService.validateUser(mockUser.email, 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  // função de login, verificando se o token de acesso é gerado corretamente
  it('should return an access token when login is called', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      department: 'IT',
      role: 'Developer',
      leaveRequests: [],
    };

    // Chama o método login do AuthService
    const result = await authService.login(mockUser);

    // Verifica se o token gerado é o esperado
    expect(result).toEqual({
      access_token: 'mockAccessToken',
    });

    // método sign do JwtService foi chamado com os parâmetros corretos
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: mockUser.email,
      sub: mockUser.id,
      role: mockUser.role,
    });
  });
});
