import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateAccountDto {
  @ApiPropertyOptional({
    example: 'Updated Account Name',
    description: 'New name for the bank account',
  })
  @IsOptional()
  @IsString()
  accountName?: string;
}
