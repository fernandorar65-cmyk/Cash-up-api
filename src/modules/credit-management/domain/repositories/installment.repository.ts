import type { Installment } from '../entities/installment';

export interface IInstallmentRepository {
  findById(id: string): Promise<Installment | null>;
  findByLoanId(loanId: string): Promise<Installment[]>;
  save(installment: Installment): Promise<void>;
  delete(id: string): Promise<void>;
}

