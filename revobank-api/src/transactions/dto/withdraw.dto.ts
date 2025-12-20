import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  IsOptional,
} from 'class-validator';
export class WithdrawDto {
  @ApiProperty({
    example: 'uuid-of-account',
    description: 'ID of the account to withdraw from',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty({
    example: 50000,
    description: 'Amount to withdraw (minimum 1)',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;
  @ApiProperty({
    example: 'ATM withdrawal',
    description: 'Description of the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
