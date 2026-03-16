import { LoanCharge } from '../../domain/entities/loan-charge.entity';

export const LOAN_CHARGE_REPOSITORY = Symbol('LoanChargeRepository');

export interface LoanChargeRepositoryPort {
  findById(id: string): Promise<LoanCharge | null>;
  findByLoanId(loanId: string): Promise<LoanCharge[]>;
  save(loanCharge: LoanCharge): Promise<void>;
}
