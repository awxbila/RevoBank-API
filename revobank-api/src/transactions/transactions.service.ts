import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { Decimal } from '@prisma/client/runtime/library';
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}
  async deposit(userId: string, depositDto: DepositDto) {
    const { accountId, amount, description } = depositDto;
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied to this account');
    }
    // Create transaction and update balance
    const [transaction, updatedAccount] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: new Decimal(amount),
          description,
          toAccountId: accountId,
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ]);
    return {
      message: 'Deposit successful',
      transaction,
      newBalance: updatedAccount.balance,
    };
  }
  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    const { accountId, amount, description } = withdrawDto;
    // Verify account ownership
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied to this account');
    }
    // Check sufficient balance
    if (account.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    // Create transaction and update balance
    const [transaction, updatedAccount] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: 'WITHDRAW',
          amount: new Decimal(amount),
          description,
          fromAccountId: accountId,
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      }),
    ]);
    return {
      message: 'Withdrawal successful',
      transaction,
      newBalance: updatedAccount.balance,
    };
  }
  async transfer(userId: string, transferDto: TransferDto) {
    const { fromAccountId, toAccountId, amount, description } = transferDto;
    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }
    // Verify source account
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });
    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }
    if (fromAccount.userId !== userId) {
      throw new ForbiddenException('Access denied to source account');
    }
    // Check sufficient balance
    if (fromAccount.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    // Verify destination account
    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });
    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }
    // Execute transfer
    const [transaction, updatedFromAccount, updatedToAccount] =
      await this.prisma.$transaction([
        this.prisma.transaction.create({
          data: {
            type: 'TRANSFER',
            amount: new Decimal(amount),
            description,
            fromAccountId,
            toAccountId,
          },
        }),
        this.prisma.account.update({
          where: { id: fromAccountId },
          data: { balance: { decrement: amount } },
        }),
        this.prisma.account.update({
          where: { id: toAccountId },
          data: { balance: { increment: amount } },
        }),
      ]);
    return {
      message: 'Transfer successful',
      transaction,
      fromAccountBalance: updatedFromAccount.balance,
      toAccountBalance: updatedToAccount.balance,
    };
  }
  async findAll(userId: string) {
    // Get user's accounts
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((account) => account.id);
    // Get transactions related to user's accounts
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: { in: accountIds } },
          { toAccountId: { in: accountIds } },
        ],
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountName: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return {
      message: 'Transactions retrieved successfully',
      transactions,
    };
  }
  async findOne(userId: string, transactionId: string) {
    // Get user's accounts
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((account) => account.id);
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountName: true,
          },
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountName: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    // Check if transaction belongs to user
    const hasAccess =
      (transaction.fromAccountId &&
        accountIds.includes(transaction.fromAccountId)) ||
      (transaction.toAccountId && accountIds.includes(transaction.toAccountId));
    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this transaction');
    }
    return {
      message: 'Transaction retrieved successfully',
      transaction,
    };
  }
}
