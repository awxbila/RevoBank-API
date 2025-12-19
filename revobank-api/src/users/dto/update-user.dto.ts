import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Updated',
    description: 'Updated user name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
