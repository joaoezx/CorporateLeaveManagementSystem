import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
            createUser: jest.fn().mockResolvedValue(mockUser),
            getUserById: jest.fn().mockResolvedValue(mockUser),
            promotion: jest
              .fn()
              .mockResolvedValue({ ...mockUser, role: 'Senior Manager' }),
            resignation: jest.fn().mockResolvedValue({ deleted: true }),
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

  const mockUser = {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    department: 'IT',
    role: 'Manager',
    leaveRequests: [],
  };

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    const result = await controller.register(createUserDto);
    expect(result).toEqual(mockUser);
    expect(service.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should get user profile', async () => {
    const result = await controller.getProfile('1');
    expect(result).toEqual(mockUser);
    expect(service.getUserById).toHaveBeenCalledWith('1');
  });

  it('should update user profile', async () => {
    const updateUserDto: UpdateUserDto = { role: 'Senior Manager' };
    const result = await controller.updateProfile('1', updateUserDto);
    expect(result).toEqual({ ...mockUser, role: 'Senior Manager' });
    expect(service.promotion).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should remove user', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ deleted: true });
    expect(service.resignation).toHaveBeenCalledWith('1');
  });
});
