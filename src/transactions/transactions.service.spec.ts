import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto, TransactionMethod } from './dto/transactions.dto';
import { User } from 'src/users/entities/user.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: ReturnType<typeof mockTransactionRepository>;

  const mockTransactionRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useFactory: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create and save a transaction', async () => {
      const mockUser = { id: 1, username: 'testuser' } as User;

      const dto: CreateTransactionDto = {
        user: mockUser,
        method: TransactionMethod.COORDINATES,
        query: '10.123,-75.456',
        result: { weather: 'sunny' },
      };

      const createdTransaction = { id: 1, ...dto };

      repository.create.mockReturnValue(createdTransaction);
      repository.save.mockResolvedValue(createdTransaction);

      const result = await service.createTransaction(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(createdTransaction);
      expect(result).toEqual(createdTransaction);
    });

    it('should throw an error if saving fails', async () => {
      const mockUser = { id: 1, username: 'testuser' } as User;

      const dto: CreateTransactionDto = {
        user: mockUser,
        method: TransactionMethod.CITY,
        query: 'Paris',
        result: { weather: 'cloudy' },
      };

      repository.create.mockReturnValue(dto);
      repository.save.mockRejectedValue(new Error('DB error'));

      await expect(service.createTransaction(dto)).rejects.toThrow('Error creating transaction');
    });
  });


  describe('getUserTransactions', () => {
    it('should return transactions for a user ordered by date DESC', async () => {
      const userId = 1;
      const transactions = [
        { id: 2, amount: 100, createdAt: new Date() },
        { id: 1, amount: 50, createdAt: new Date() },
      ];

      repository.find.mockResolvedValue(transactions);

      const result = await service.getUserTransactions(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(transactions);
    });
  });
});
