import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  username: 'testuser',
  password: 'hashedPassword',
  // Agrega otras propiedades si es necesario
} as User;

const mockUsersService = {
  findByUsername: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  decode: jest.fn(),
};

const mockSessionRepo = {
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

jest.mock('src/utils/password', () => ({
  comparePassword: jest.fn(),
}));

import { comparePassword } from 'src/utils/password';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(Session), useValue: mockSessionRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');
      expect(result).toEqual({ id: 1, username: 'testuser' });
    });

    it('should throw if credentials are invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('testuser', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token and save session', async () => {
      mockJwtService.sign.mockReturnValue('fake.jwt.token');
      mockJwtService.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
      mockSessionRepo.create.mockReturnValue({ user: mockUser, token: 'fake.jwt.token', expiresAt: new Date(), isActive: true });
      mockSessionRepo.save.mockResolvedValue({});

      const result = await service.login(mockUser);

      expect(result).toEqual({ access_token: 'fake.jwt.token' });
      expect(mockSessionRepo.update).toHaveBeenCalledWith({ isActive: true, user: mockUser }, { isActive: false });
      expect(mockSessionRepo.save).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should deactivate the session and return success', async () => {
      const mockSession = { token: 'token', isActive: true };
      mockSessionRepo.findOne.mockResolvedValue(mockSession);
      mockSessionRepo.save.mockResolvedValue({});

      const result = await service.logout('token');
      expect(result).toEqual({ message: 'User logged out successfully', status: true });
    });

    it('should throw if session is not found', async () => {
      mockSessionRepo.findOne.mockResolvedValue(null);
      await expect(service.logout('invalid')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('ok', () => {
    it('should return ok message', async () => {
      expect(await service.ok()).toEqual({ message: 'ok', status: true });
    });
  });
});
