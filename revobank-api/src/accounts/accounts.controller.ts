import {
Controller,
Get,
Post,
Body,
Patch,
Param,
Delete,
UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
constructor(private accountsService: AccountsService) {}
@Post()
@ApiOperation({ summary: 'Create a new bank account' })
@ApiResponse({ 
    status: 201, 
    description: 'Account created successfully',
    schema: {
      example: {
        message: 'Account created successfully',
        account: {
          id: 
'uuid',
          accountNumber: 'ACC1234567890',
          accountName: 'My Savings Account',
          balance: '0',
          userId: 'uuid',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
}
}
}
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
async create(@CurrentUser() user: any, @Body() createAccountDto: CreateAccountDto) {
return this.accountsService.create(user.userId, createAccountDto);
@Get()
@ApiOperation({ summary: 'Get all user accounts' })
@ApiResponse({ 
    status: 200, 
    description: 'Accounts retrieved successfully',
    schema: {
      example: {
        message: 'Accounts retrieved successfully',
        accounts: [
{
            id: 'uuid',
            accountNumber: 'ACC1234567890',
            accountName: 'My Savings Account',
            balance: '1000000',
            userId: 'uuid',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z'
}
        ]
    }
}
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
async findAll(@CurrentUser() user: any) {
 return this.accountsService.findAll(user.userId);
}

@Get(':id')
@ApiOperation({ summary: 'Get specific account' })
@ApiResponse({ status: 200, description: 'Account retrieved successfully' })
@ApiResponse({ status: 404, description: 'Account not found' })
async findOne(@CurrentUser() user: any, @Param('id') id: string) {
return this.accountsService.findOne(user.userId, id);
}
@Patch(':id')
@ApiOperation({ summary: 'Update account' })
@ApiResponse({ status: 200, description: 'Account updated successfully' })
@ApiResponse({ status: 404, description: 'Account not found' })
async update(
@CurrentUser() user: any,
@Param('id') id: string,
@Body() updateAccountDto: UpdateAccountDto,
) {
    return this.accountsService.update(user.userId, id, updateAccountDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountsService.remove(user.userId, id);
  }
}