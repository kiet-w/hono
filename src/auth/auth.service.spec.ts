import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
    findRefreshToken: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.create.mockResolvedValue({ id: '1', ...registerDto, password: hashedPassword });

      const result = await service.register(registerDto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        passwordHash: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });
      expect(result).toEqual({ id: '1', ...registerDto, password: hashedPassword });
    });
  });

  describe('login', () => {
    it('should sign access and refresh tokens and return sanitized user data', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'CUSTOMER',
        profile: {
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.png',
          phone: '0123456789',
        },
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') {
          return 'access-secret';
        }

        if (key === 'JWT_REFRESH_SECRET') {
          return 'refresh-secret';
        }

        return undefined;
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(loginDto as any);

      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { sub: user.id, email: user.email, role: user.role },
        { secret: 'access-secret', expiresIn: '1h' },
      );
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: user.id, email: user.email, role: user.role },
        { secret: 'refresh-secret', expiresIn: '7d' },
      );
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        'refresh-token',
      );
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    });
  });

  describe('refresh', () => {
    it('should return tokens and sanitized user data from refresh token lookup', async () => {
      const tokenData = {
        userId: 'user-1',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'user-1',
          email: 'test@example.com',
          password: 'hashed-password',
          role: 'CUSTOMER',
          profile: {
            firstName: 'Test',
            lastName: 'User',
            avatarUrl: null,
            phone: null,
          },
        },
      };

      mockUsersService.findRefreshToken.mockResolvedValue(tokenData);
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') {
          return 'access-secret';
        }

        if (key === 'JWT_REFRESH_SECRET') {
          return 'refresh-secret';
        }

        return undefined;
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.refresh('refresh-token');

      expect(mockUsersService.findRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        data: {
          id: tokenData.user.id,
          email: tokenData.user.email,
          role: tokenData.user.role,
          profile: tokenData.user.profile,
        },
      });
      expect(result).not.toHaveProperty('password');
    });
  });
});
