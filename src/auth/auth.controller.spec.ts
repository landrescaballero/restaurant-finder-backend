import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/users.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    ok: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should validate user and return access token', async () => {
      const loginDto: LoginDto = { username: 'user', password: 'pass' };
      const mockUser = { id: 1, username: 'user' };
      const mockToken = { access_token: 'fake.jwt.token' };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);
      expect(result).toEqual(mockToken);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith('user', 'pass');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw if user is not valid', async () => {
      mockAuthService.validateUser.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login({ username: 'x', password: 'y' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateSession', () => {
    it('should return ok response', async () => {
      const okResponse = { message: 'ok', status: true };
      mockAuthService.ok.mockResolvedValue(okResponse);

      const result = await controller.ok();
      expect(result).toEqual(okResponse);
    });
  });

  describe('logout', () => {
    it('should logout using token', async () => {
      const token = 'fake.jwt.token';
      const logoutResponse = { message: 'User logged out successfully', status: true };
      mockAuthService.logout.mockResolvedValue(logoutResponse);

      const result = await controller.logout(token);
      expect(result).toEqual(logoutResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(token);
    });
  });
});
