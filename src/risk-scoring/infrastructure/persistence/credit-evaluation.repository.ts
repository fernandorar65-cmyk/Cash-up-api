import { Injectable } from '@nestjs/common';
import { CreditEvaluationRepositoryPort } from '../../application/ports/credit-evaluation.repository.port';

@Injectable()
export class CreditEvaluationRepository
  implements CreditEvaluationRepositoryPort
{
  async findById(): Promise<null> {
    return null;
  }
  async findByClientId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
