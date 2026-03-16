/**
 * Entidad de dominio: Vinculación préstamo original → refinanciado.
 * Credit Management
 */
export class LoanRefinance {
  constructor(
    public readonly id: string,
    public readonly originalLoanId: string,
    public readonly newLoanId: string,
    public readonly refinancedAt: Date,
  ) {}
}
