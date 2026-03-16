/**
 * Entidad de dominio: Historial de cambios del préstamo.
 * Credit Management
 */
export class LoanHistory {
  constructor(
    public readonly id: string,
    public readonly loanId: string,
    public readonly action: string,
    public readonly previousState: Record<string, unknown> | null,
    public readonly newState: Record<string, unknown> | null,
    public readonly userId: string,
    public readonly createdAt: Date,
  ) {}
}
