import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', username: 'jd' }  as User;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockTransactionsService = {
    createTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRestaurantsByCoordinates', () => {
    it('should return restaurant data and log transaction', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockedAxios.post.mockResolvedValue({
        data: {
          places: [
            {
              displayName: { text: 'Test Restaurant' },
              formattedAddress: '123 Test St',
              googleMapsUri: 'https://maps.google.com/test',
              websiteUri: 'https://test.com',
              types: ['restaurant'],
            },
          ],
        },
      });

      const result = await service.getRestaurantsByCoordinates(1, '10.0', '20.0');

      expect(result).toEqual([
        {
          name: 'Test Restaurant',
          address: '123 Test St',
          mapUrl: 'https://maps.google.com/test',
          websiteUrl: 'https://test.com',
          types: ['restaurant'],
        },
      ]);

      expect(mockTransactionsService.createTransaction).toHaveBeenCalled();
    });
  });
});
