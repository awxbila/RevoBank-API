import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Post('deposit')
  @ApiOperation({ summary: 'Deposit to account' })
  @ApiResponse({
    status: 201,
    description: 'Deposit successful',
    schema: {
      example: {
        message: 'Deposit successful',
        transaction: {
          id: 'uuid',
          type: 'DEPOSIT',
          amount: '100000',
          status: 'SUCCESS',
          description: 'Salary deposit',
          toAccountId: 'uuid',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
        newBalance: '1100000',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.transactionsService.deposit(user.userId, depositDto);
  }
  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from account' })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal successful',
    schema: {
      example: {
        message: 'Withdrawal successful',
        transaction: {
          id: 'uuid',
          type: 'WITHDRAW',
          amount: '50000',
          status: 'SUCCESS',
          description: 'ATM withdrawal',
          fromAccountId: 'uuid',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
        newBalance: '950000',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  async withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return this.transactionsService.withdraw(user.userId, withdrawDto);
  }
  @Post('transfer')
  @ApiOperation({ summary: 'Transfer between accounts' })
  @ApiResponse({
    status: 201,
    description: 'Transfer successful',
    schema: {
      example: {
        message: 'Transfer successful',
        transaction: {
          id: 'uuid',
          type: 'TRANSFER',
          amount: '200000',
          status: 'SUCCESS',
          description: 'Transfer to friend',
          fromAccountId: 'uuid',
          toAccountId: 'uuid',
          createdAt: '2025-01-01T00:00:00.000Z',
        },
        fromAccountBalance: '800000',
        toAccountBalance: '3200000',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid transfer' })
  async transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return this.transactionsService.transfer(user.userId, transferDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    schema: {
      example: {
        message: 'Transactions retrieved successfully',
        transactions: [
          {
            id: 'uuid',
            type: 'DEPOSIT',
            amount: '100000',
            status: 'SUCCESS',
            description: 'Salary deposit',
            fromAccountId: null,
            toAccountId: 'uuid',
            createdAt: '2025-01-01T00:00:00.000Z',
            fromAccount: null,
            toAccount: {
              accountNumber: 'ACC1234567890',
              accountName: 'My Savings Account',
            },
          },
        ],
      },
    },
  })
  async findAll(@CurrentUser() user: any) {
    return this.transactionsService.findAll(user.userId);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionsService.findOne(user.userId, id);
  }
}
