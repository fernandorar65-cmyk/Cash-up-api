import { Loan } from '../../domain/entities/loan.entity';

export const LOAN_REPOSITORY = Symbol('LoanRepository');

export interface LoanRepositoryPort {
  findById(id: string): Promise<Loan | null>;
  findByClientId(clientId: string): Promise<Loan[]>;
  findByStatus(status: string): Promise<Loan[]>;
  save(loan: Loan): Promise<void>;
}
