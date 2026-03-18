import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'DNI',
    maxLength: 50,
    description: 'Tipo de documento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  documentType: string;

  @ApiProperty({
    example: '12345678',
    maxLength: 50,
    description: 'Número de documento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  documentNumber: string;

  @ApiProperty({ example: 'Juan Pérez', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'juan@mail.com', nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string | null;

  @ApiPropertyOptional({ example: '+51987654321', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;

  @ApiProperty({ example: 3500.5, description: 'Ingreso mensual' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyIncome: number;
}

