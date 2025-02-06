import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      role: 'Manager',
    };

    const user = service.createUser(userDto);

    expect(user).toEqual(userDto);

    expect(service.getAllUsers().length).toBe(1);
    expect(service.getAllUsers()[0]).toEqual(userDto);
  });

  it('should create a new user', () => {
    const userDto1: CreateUserDto = {
      name: 'Alice',
      email: 'alice@example.com',
      department: 'HR',
      role: 'Manager',
    };

    const userDto2: CreateUserDto = {
      name: 'joao',
      email: 'joao@example.com',
      department: 'finance',
      role: 'analyst',
    };

    const userDto3: CreateUserDto = {
      name: 'pedro',
      email: 'pedro@example.com',
      department: 'marketing',
      role: 'analyst',
    };

    service.createUser(userDto1);
    service.createUser(userDto2);
    service.createUser(userDto3);

    const users = service.getAllUsers();
    expect(users.length).toBe(3);
    expect(users[0]).toEqual(userDto1);
    expect(users[1]).toEqual(userDto2);
    expect(users[2]).toEqual(userDto3);
  });

  it('should find a user by email', () => {
    const userDto1: CreateUserDto = {
      name: 'Alice',
      email: 'alice@example.com',
      department: 'HR',
      role: 'Manager',
    };

    service.createUser(userDto1);

    const findUser = service.getUserByEmail(userDto1.email);
    expect(findUser).toEqual(userDto1);
  });
});
