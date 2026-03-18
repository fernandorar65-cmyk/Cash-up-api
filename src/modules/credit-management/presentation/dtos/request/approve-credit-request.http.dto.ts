import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';

export class ApproveCreditRequestHttpDto {
  @ApiProperty({ example: 10000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  approvedAmount: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(1)
  approvedTermMonths: number;

  @ApiProperty({ example: 24.5, description: 'Tasa anual en %' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  approvedInterestRate: number;

  @ApiProperty({ example: 'FIXED_ANNUAL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  approvedInterestType: string;

  @ApiPropertyOptional({
    description: 'Fecha primera cuota (ISO). Por defecto +1 mes.',
  })
  @IsOptional()
  @IsDateString()
  firstInstallmentDueDate?: string;
}

