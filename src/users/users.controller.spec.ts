import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm';

describe('UsersController', () => {
  let service: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, // Mocka o serviço de usuários
          useValue: {
            createUser: jest.fn(), // Mocka a função de criação de usuário
            getUserById: jest.fn(), // Mocka a função de busca por ID
            promotion: jest.fn(), // Mocka a função de promoção de usuário
            resignation: jest.fn(), // Mocka a função de remoção de usuário
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    // Define os dados de entrada para criação de usuário
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    const correctUser = { id: '1', ...createUserDto };

    // Mocka a função do serviço para retornar o usuário correto
    jest.spyOn(service, 'createUser').mockResolvedValue(correctUser);

    // método register do controller e verifica se o retorno está correto
    const result = await controller.register(createUserDto);
    expect(result).toEqual(correctUser);

    expect(service.createUser).toHaveBeenLastCalledWith(createUserDto);
  });

  it('should return a user by ID', async () => {
    // Define os dados do usuário
    const correctUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    // Mocka a função de busca por ID para retornar o usuário correto
    jest.spyOn(service, 'getUserById').mockResolvedValue(correctUser);

    // método findOne do controller e verifica se o resultado está correto
    const result = await controller.findOne('1');
    expect(result).toEqual(correctUser);
    expect(service.getUserById).toHaveBeenCalledWith('1');
  });

  it('should promote a user', async () => {
    // dados de entrada para o teste de promoção de usuário
    const updateUserDto: UpdateUserDto = {
      role: 'Director',
    };

    // dados de um usuário válido
    const correctUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    // Mocka a função de promoção para retornar o usuário atualizado
    jest.spyOn(service, 'promotion').mockResolvedValue(correctUser);

    // método updateProfile do controller e verifica se o resultado está correto
    const result = await controller.updateProfile('1', updateUserDto);
    expect(result).toEqual(correctUser);
    expect(service.promotion).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should delete a user', async () => {
    const deleteResult: DeleteResult = { affected: 1, raw: [] };

    // Mocka a função de remoção de usuário para retornar o resultado correto
    jest.spyOn(service, 'resignation').mockResolvedValue(deleteResult);

    // método remove do controller e verifica se o resultado está correto
    const result = await controller.remove('1');
    expect(result).toEqual(deleteResult);
    expect(service.resignation).toHaveBeenCalledWith('1');
  });
});
