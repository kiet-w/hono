import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = { email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User' };
      await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      const req = { user: { userId: '1' } };
      await controller.logout(req);
      expect(service.logout).toHaveBeenCalledWith('1');
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh', async () => {
      const dto = { refreshToken: 'token' };
      await controller.refresh(dto);
      expect(service.refresh).toHaveBeenCalledWith(dto.refreshToken);
    });
  });

  describe('getMe', () => {
    it('should return req.user', async () => {
      const req = { user: { userId: '1', email: 'test@example.com' } };
      const result = await controller.getMe(req);
      expect(result).toEqual(req.user);
    });
  });
});
