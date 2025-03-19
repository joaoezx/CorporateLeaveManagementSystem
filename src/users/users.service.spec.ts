import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    _id: '507f191e810c19729de860ea',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'XXXXXXXXXXX',
    department: 'IT',
    role: 'Manager',
  };

  const mockUserModel = {
    new: jest.fn().mockImplementation(dto => ({
      ...dto,
      save: jest.fn().mockResolvedValue(mockUser),
    })),
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // Registra o UsersService para ser testado
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel, // Usa a classe Repository como mock
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'XXXXXXXXXXX',
      department: 'IT',
      role: 'Manager',
    };

    const result = await service.createUser(userDto);
    expect(result).toEqual(mockUser);
    expect(userModel.create).toHaveBeenCalledWith(userDto);
  });

  it('should return all users', async () => {
    const users = await service.getAllUsers();
    expect(users).toEqual([mockUser]);
    expect(userModel.find).toHaveBeenCalled();
  });

  it('should find a user by email', async () => {
    const user = await service.findByEmail('john.doe@example.com');
    expect(user).toEqual(mockUser);
    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
    });
  });

  it('should return null if email not found', async () => {
    jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(null);
    const user = await service.findByEmail('notfound@example.com');
    expect(user).toBeNull();
  });

  it('should find a user by ID', async () => {
    const user = await service.getUserById('507f191e810c19729de860ea');
    expect(user).toEqual(mockUser);
    expect(userModel.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
  });

  it('should update a user and return the updated user', async () => {
    const updateUserDto: UpdateUserDto = { role: 'Senior Manager' };

    const updatedUser = { ...mockUser, role: 'Senior Manager' };
    jest
      .spyOn(userModel, 'findByIdAndUpdate')
      .mockResolvedValue(updatedUser as any);

    const result = await service.promotion(
      '507f191e810c19729de860ea',
      updateUserDto,
    );
    expect(result).toEqual(updatedUser);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f191e810c19729de860ea',
      updateUserDto,
      { new: true },
    );
  });

  it('should delete a user', async () => {
    const result = await service.resignation('507f191e810c19729de860ea');
    expect(result).toEqual({ deleted: true });
    expect(userModel.deleteOne).toHaveBeenCalledWith({
      _id: '507f191e810c19729de860ea',
    });
  });
});
