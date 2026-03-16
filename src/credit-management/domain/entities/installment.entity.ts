/**
 * Entidad de dominio: Cuota del cronograma.
 * Credit Management
 */
export type InstallmentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export class Installment {
  constructor(
    public readonly id: string,
    public readonly loanId: string,
    public readonly number: number,
    public readonly dueDate: Date,
    public readonly principalAmount: number,
    public readonly interestAmount: number,
    public readonly totalAmount: number,
    public readonly status: InstallmentStatus,
    public readonly paidAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
