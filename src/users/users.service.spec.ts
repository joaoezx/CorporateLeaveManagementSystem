import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // Registra o UsersService para ser testado
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Usa a classe Repository como mock
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    const user = { id: '1', leaveRequest: [], ...userDto }; // Usuário com ID

    // Mocks dos métodos do repositório
    jest.spyOn(userRepository, 'create').mockReturnValue(user as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(user as any);

    const result = await service.createUser(userDto);
    expect(result).toEqual(user);
    expect(userRepository.create).toHaveBeenCalledWith(userDto);
    expect(userRepository.save).toHaveBeenCalledWith(userDto);
  });

  it('should return a user by id', async () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any); // Mocks o método findOne

    const result = await service.getUserById('1');
    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should update a user and return the updated user', async () => {
    const updateUserDto: UpdateUserDto = { role: 'Manager' }; // DTO de atualização
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Analyst',
    };
    const updatedUser = { ...user, role: 'Manager' }; // Usuário após a atualização

    // Mocks dos métodos do repositório
    jest
      .spyOn(userRepository, 'update')
      .mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser as any);

    const result = await service.promotion('1', updateUserDto);
    expect(result).toEqual(updatedUser);
    expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should delete a user', async () => {
    // Mocks do método delete
    jest
      .spyOn(userRepository, 'delete')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await service.resignation('1');
    expect(result).toEqual({ affected: 1 });
    expect(userRepository.delete).toHaveBeenCalledWith('1');
  });
});
