import { LoanRefinance } from '../../domain/entities/loan-refinance.entity';

export const LOAN_REFINANCE_REPOSITORY = Symbol('LoanRefinanceRepository');

export interface LoanRefinanceRepositoryPort {
  findById(id: string): Promise<LoanRefinance | null>;
  findByOriginalLoanId(loanId: string): Promise<LoanRefinance | null>;
  save(loanRefinance: LoanRefinance): Promise<void>;
  delete(id: string): Promise<void>;
}
