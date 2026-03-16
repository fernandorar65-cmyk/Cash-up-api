import { Injectable } from '@nestjs/common';
import { PenaltyPolicyRepositoryPort } from '../../application/ports/penalty-policy.repository.port';

@Injectable()
export class PenaltyPolicyRepository implements PenaltyPolicyRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findAllActive(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
