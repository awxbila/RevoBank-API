import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  IsOptional,
} from 'class-validator';
export class DepositDto {
  @ApiProperty({
    example: 'uuid-of-account',
    description: 'ID of the account to deposit to',
  })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
  @ApiProperty({
    example: 100000,
    description: 'Amount to deposit (minimum 1)',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;
  @ApiProperty({
    example: 'Salary deposit',
    description: 'Description of the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
