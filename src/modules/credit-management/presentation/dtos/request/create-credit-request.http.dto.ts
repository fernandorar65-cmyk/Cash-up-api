import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCreditRequestHttpDto {
  @ApiProperty({ example: 10000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  requestedAmount: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(1)
  termMonths: number;

  @ApiPropertyOptional({ example: 'PEN' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: 'Personal' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  purpose?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  clientNotes?: string | null;
}

