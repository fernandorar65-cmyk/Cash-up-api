import { LoanHistory } from '../../domain/entities/loan-history.entity';

export const LOAN_HISTORY_REPOSITORY = Symbol('LoanHistoryRepository');

export interface LoanHistoryRepositoryPort {
  findById(id: string): Promise<LoanHistory | null>;
  findByLoanId(loanId: string): Promise<LoanHistory[]>;
  save(loanHistory: LoanHistory): Promise<void>;
  delete(id: string): Promise<void>;
}
