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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    const user = { id: '1', ...userDto };

    jest.spyOn(userRepository, 'create').mockReturnValue(user as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(user);

    const result = await service.createUser(userDto);
    expect(result).toEqual(user);
    expect(userRepository.create).toHaveBeenCalledWith(userDto);
    expect(userRepository.save).toHaveBeenCalledWith(userDto);
  });

  it('should return a user by email', async () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

    const result = await service.getUserByEmail('john.doe@example.com');
    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'john.doe@example.com' },
    });
  });

  it('should update a user and return the updated user', async () => {
    const updateUserDto: UpdateUserDto = { role: 'Manager' };
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Analyst',
    };
    const updatedUser = { ...user, updateUserDto };

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
    jest
      .spyOn(userRepository, 'delete')
      .mockResolvedValue({ affected: 1 } as any);

    const result = await service.resignation('1');
    expect(result).toEqual({ affected: 1 });
    expect(userRepository.delete).toHaveBeenCalledWith('1');
  });
});
