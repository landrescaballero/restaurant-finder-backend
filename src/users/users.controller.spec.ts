import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    registerUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call UsersService.registerUser and return the result', async () => {
      const dto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = {
        data: { id: 1, username: dto.username, firstName: dto.firstName, lastName: dto.lastName },
        message: 'User registered successfully',
        status: true,
      };

      mockUsersService.registerUser.mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      expect(mockUsersService.registerUser).toHaveBeenCalledWith(dto);
    });
  });
});
