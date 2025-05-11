import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/users.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository;
  
  const mockUserRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    const mockDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should throw ConflictException if username exists', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1, username: 'testuser' });

      await expect(service.registerUser(mockDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(null); 

      await expect(service.registerUser(mockDto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should register user successfully', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({
        id: 1,
        username: mockDto.username,
        firstName: mockDto.firstName,
        lastName: mockDto.lastName,
        password: 'hashed_password',
      });

      const result = await service.registerUser(mockDto);

      expect(result).toEqual({
        data: {
          id: 1,
          username: mockDto.username,
          firstName: mockDto.firstName,
          lastName: mockDto.lastName,
        },
        message: 'User registered successfully',
        status: true,
      });
    });
  });
});
