import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'John Doe',
    department: 'IT',
    role: 'Developer',
    leaveRequests: [],
  };

  // Mocking bcrypt.compare
  const bcryptCompareMock = jest
    .spyOn(bcrypt, 'compare')
    .mockResolvedValue(true);

  // Creating the testing module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockUser), // Mocking the UsersService
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'), // Mocking the JwtService
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // Reset all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate a user and return user data', async () => {
    // Test case: Valid user
    const email = 'test@example.com';
    const password = 'password123';

    // Call the service method
    const result = await authService.validateUser(email, password);

    // Assertions
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      department: mockUser.department,
      role: mockUser.role,
      leaveRequests: mockUser.leaveRequests,
    });

    // Ensuring bcrypt.compare was called
    expect(bcryptCompareMock).toHaveBeenCalledWith(password, mockUser.password);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    // Mocking `findByEmail` to return null (user not found)
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    // Call the service method and expect an exception
    await expect(
      authService.validateUser('invalidEmail', 'password123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    // Mocking bcrypt.compare to return false (invalid password)
    bcryptCompareMock.mockResolvedValue(false);

    // Call the service method and expect an exception
    await expect(
      authService.validateUser(mockUser.email, 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return an access token when login is called', async () => {
    // Call the login method
    const result = await authService.login(mockUser);

    // Assertions
    expect(result).toEqual({
      access_token: 'mockAccessToken',
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: mockUser.email,
      sub: mockUser.id,
      role: mockUser.role,
    });
  });
});
