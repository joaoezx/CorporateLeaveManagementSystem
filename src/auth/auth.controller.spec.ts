import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Criação de um mock do AuthService para simular o comportamento do método login
    const mockAuthService = {
      login: jest.fn().mockResolvedValue({ access_token: 'mockAccessToken' }), // Retorna um token simulado
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Substitui o AuthService real pelo mock
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // método login do controller chama o login do AuthService corretamente
  it('should call login and return access token', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    const result = await authController.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);

    // Verifica se o resultado retornado pelo controller é o esperado
    expect(result).toEqual({ access_token: 'mockAccessToken' });
  });
});
