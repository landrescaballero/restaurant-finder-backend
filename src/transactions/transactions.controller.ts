import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async getUserTransactions(@User('userId') userId: number) {
        return await this.transactionsService.getUserTransactions(userId);
    }
}
