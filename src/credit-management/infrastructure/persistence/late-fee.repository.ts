import { Injectable } from '@nestjs/common';
import { LateFeeRepositoryPort } from '../../application/ports/late-fee.repository.port';

@Injectable()
export class LateFeeRepository implements LateFeeRepositoryPort {
  async findById(): Promise<null> {
    return null;
  }
  async findByInstallmentId(): Promise<[]> {
    return [];
  }
  async save(): Promise<void> {}
}
