import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class RunCreditEvaluationHttpDto {
  @ApiPropertyOptional({
    description: '1 = positivo, 2 = negativo; si no se envía = aleatorio',
    enum: [1, 2],
  })
  @IsOptional()
  @IsIn([1, 2])
  evaluationOutcome?: 1 | 2;
}

