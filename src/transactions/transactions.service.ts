import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { CreateTransactionDto } from './dto/transactions.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    /**
     * Creates a new transaction and saves it to the database.
     * @param transactionData - The data for the transaction (amount, type, and date).
     * @returns A promise that resolves to the created transaction.
     */
    async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
        try {
            const transaction = this.transactionRepository.create(transactionData);
            return await this.transactionRepository.save(transaction);
        } catch (error) {
            throw new Error('Error creating transaction');
        }
    }

    /**
     * Retrieves a list of transactions for a specific user.
     * @param userId - The ID of the user whose transactions are being retrieved.
     * @returns A promise that resolves to an array of transactions, ordered by creation date in descending order.
     */
    async getUserTransactions(userId: number): Promise<Transaction[]> {
        return await this.transactionRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
}
