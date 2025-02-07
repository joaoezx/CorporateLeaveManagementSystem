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
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            promotion: jest.fn(),
            resignation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    const correctUser = { id: '1', ...createUserDto };

    jest.spyOn(service, 'createUser').mockResolvedValue(correctUser);

    const result = await controller.register(createUserDto);
    expect(result).toEqual(correctUser);
    expect(service.createUser).toHaveBeenLastCalledWith(createUserDto);
  });

  it('should return a user by ID', async () => {
    const correctUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    jest.spyOn(service, 'getUserById').mockResolvedValue(correctUser);

    const result = await controller.findOne('1');
    expect(result).toEqual(correctUser);
    expect(service.getUserById).toHaveBeenCalledWith('1');
  });

  it('should promote a user', async () => {
    const updateUserDto: UpdateUserDto = {
      role: 'Director',
    };
    const correctUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    jest.spyOn(service, 'promotion').mockResolvedValue(correctUser);

    const result = await controller.updateProfile('1', updateUserDto);
    expect(result).toEqual(correctUser);
    expect(service.promotion).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should delete a user', async () => {
    const deleteResult: DeleteResult = { affected: 1, raw: [] };

    jest.spyOn(service, 'resignation').mockResolvedValue(deleteResult);

    const result = await controller.remove('1');

    expect(result).toEqual(deleteResult);
    expect(service.resignation).toHaveBeenCalledWith('1');
  });
});
