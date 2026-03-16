/**
 * Entidad de dominio: Préstamo.
 * Credit Management
 */
export type LoanStatus =
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'disbursed'
  | 'refinanced'
  | 'closed';

export class Loan {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly interestRate: number,
    public readonly termMonths: number,
    public readonly interestType: string,
    public readonly status: LoanStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
