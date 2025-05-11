import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

const mockTransactionsService = {
  getUserTransactions: jest.fn(),
};

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserTransactions', () => {
    it('should return transactions for a user', async () => {
      const userId = 1;
      const mockTransactions = [
        { id: 1, method: 'city', query: 'Paris' },
        { id: 2, method: 'coordinates', query: '10.123,-75.456' },
      ];

      mockTransactionsService.getUserTransactions.mockResolvedValue(mockTransactions);

      const result = await controller.getUserTransactions(userId);

      expect(service.getUserTransactions).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTransactions);
    });
  });
});
