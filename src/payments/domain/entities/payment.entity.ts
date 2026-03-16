/**
 * Entidad de dominio: Pago realizado.
 * Payments
 */
export class Payment {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly loanId: string,
    public readonly amount: number,
    public readonly method: string,
    public readonly reference: string | null,
    public readonly paidAt: Date,
    public readonly createdAt: Date,
  ) {}
}
