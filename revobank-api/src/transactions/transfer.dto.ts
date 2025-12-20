import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  IsOptional,
} from 'class-validator';
export class TransferDto {
  @ApiProperty({
    example: 'uuid-of-from-account',
    description: 'ID of the source account',
  })
  @IsUUID()
  @IsNotEmpty()
  fromAccountId: string;
  @ApiProperty({
    example: 'uuid-of-to-account',
    description: 'ID of the destination account',
  })
  @IsUUID()
  @IsNotEmpty()
  toAccountId: string;
  @ApiProperty({
    example: 200000,
    description: 'Amount to transfer (minimum 1)',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;
  @ApiProperty({
    example: 'Transfer to friend',
    description: 'Description of the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
