/**
 * Entidad de dominio: Cargo adicional (comisión, seguro, gasto).
 * Credit Management
 */
export class LoanCharge {
  constructor(
    public readonly id: string,
    public readonly loanId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly description: string | null,
    public readonly createdAt: Date,
  ) {}
}
