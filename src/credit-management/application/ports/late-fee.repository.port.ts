import { LateFee } from '../../domain/entities/late-fee.entity';

export const LATE_FEE_REPOSITORY = Symbol('LateFeeRepository');

export interface LateFeeRepositoryPort {
  findById(id: string): Promise<LateFee | null>;
  findByInstallmentId(installmentId: string): Promise<LateFee[]>;
  save(lateFee: LateFee): Promise<void>;
}
