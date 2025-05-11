import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  const mockRestaurantsService = {
    getRestaurantsByCoordinates: jest.fn(),
    getRestaurantsByCity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: mockRestaurantsService,
        },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRestaurantsByCoordinates', () => {
    it('should call service with correct arguments and return result', async () => {
      const userId = 1;
      const query = { lat: '10.0', lng: '20.0' };
      const mockResult = [{ name: 'Test Restaurant' }];

      mockRestaurantsService.getRestaurantsByCoordinates.mockResolvedValue(mockResult);

      const result = await controller.getRestaurantsByCoordinates(query, userId);

      expect(service.getRestaurantsByCoordinates).toHaveBeenCalledWith(userId, '10.0', '20.0');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getRestaurantsByCity', () => {
    it('should call service with correct arguments and return result', async () => {
      const userId = 1;
      const query = { city: 'Paris' };
      const mockResult = [{ name: 'French Bistro' }];

      mockRestaurantsService.getRestaurantsByCity.mockResolvedValue(mockResult);

      const result = await controller.getRestaurantsByCity(query, userId);

      expect(service.getRestaurantsByCity).toHaveBeenCalledWith(userId, 'Paris');
      expect(result).toEqual(mockResult);
    });
  });
});
