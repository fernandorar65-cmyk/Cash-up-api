import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateAnalystHttpDto {
  @ApiProperty({ example: 'analista@cashup.com', description: 'Email del analista' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'María Analista', maxLength: 255, description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'passwordSeguro123', minLength: 6, description: 'Contraseña inicial' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

