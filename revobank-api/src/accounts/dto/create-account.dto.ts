import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAccountDto {
  @ApiProperty({
    example: 'My Savings Account',
    description: 'Name of the bank account',
  })
  @IsString()
  @IsNotEmpty()
  accountName: string;
}
