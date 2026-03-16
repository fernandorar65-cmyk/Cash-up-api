/**
 * Entidad de dominio: Distribución del pago en principal, interés y mora por cuota(s).
 * Payments
 */
export class PaymentApplication {
  constructor(
    public readonly id: string,
    public readonly paymentId: string,
    public readonly installmentId: string,
    public readonly principalAmount: number,
    public readonly interestAmount: number,
    public readonly lateFeeAmount: number,
    public readonly appliedAt: Date,
  ) {}
}
