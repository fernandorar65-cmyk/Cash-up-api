import type { Loan } from '../entities/loan';

export interface ILoanRepository {
  findById(id: string): Promise<Loan | null>;
  findByClientId(clientId: string): Promise<Loan[]>;
  findByStatus(status: string): Promise<Loan[]>;
  save(loan: Loan): Promise<void>;
  delete(id: string): Promise<void>;
}

