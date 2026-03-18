import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectCreditRequestHttpDto {
  @ApiProperty({ example: 'Score insuficiente para el monto solicitado.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  rejectionReason: string;
}

