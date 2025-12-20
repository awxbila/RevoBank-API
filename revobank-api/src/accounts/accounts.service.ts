import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  private generateAccountNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ACC${timestamp.slice(-6)}${random}`;
  }
  async create(userId: string, createAccountDto: CreateAccountDto) {
    const accountNumber = this.generateAccountNumber();
    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        accountName: createAccountDto.accountName,
        userId,
      },
    });
    return {
      message: 'Account created successfully',
      account,
    };
  }
  async findAll(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      message: 'Accounts retrieved successfully',
      accounts,
    };
  }
  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied to this account');
    }
    return {
      message: 'Account retrieved successfully',
      account,
    };
  }
  async update(
    userId: string,
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied to this account');
    }
    const updatedAccount = await this.prisma.account.update({
      where: { id: accountId },
      data: updateAccountDto,
    });
    return {
      message: 'Account updated successfully',
      account: updatedAccount,
    };
  }
  async remove(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied to this account');
    }
    await this.prisma.account.delete({
      where: { id: accountId },
    });
    return {
      message: 'Account deleted successfully',
    };
  }
}
