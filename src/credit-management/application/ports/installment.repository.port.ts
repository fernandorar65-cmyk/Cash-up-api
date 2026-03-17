import { Installment } from '../../domain/entities/installment.entity';

export const INSTALLMENT_REPOSITORY = Symbol('InstallmentRepository');

export interface InstallmentRepositoryPort {
  findById(id: string): Promise<Installment | null>;
  findByLoanId(loanId: string): Promise<Installment[]>;
  save(installment: Installment): Promise<void>;
  delete(id: string): Promise<void>;
}
