import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { HttpExceptionDto } from 'src/auth/dto/auth-response.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    @ApiOperation({ summary: 'Get all transactions of a user' })
    @ApiResponse({
        status: 200,
        description: 'List of transactions for the user',
        type: TransactionResponseDto,
        isArray: true,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized access',
        type: HttpExceptionDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
        type: HttpExceptionDto,
    })
    async getUserTransactions(@User('userId') userId: number) {
        return await this.transactionsService.getUserTransactions(userId);
    }
}
