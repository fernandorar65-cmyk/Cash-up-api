/**
 * Entidad de dominio: Penalidad por atraso en cuota.
 * Credit Management
 */
export class LateFee {
  constructor(
    public readonly id: string,
    public readonly installmentId: string,
    public readonly amount: number,
    public readonly appliedAt: Date,
    public readonly penaltyPolicyId: string,
  ) {}
}
