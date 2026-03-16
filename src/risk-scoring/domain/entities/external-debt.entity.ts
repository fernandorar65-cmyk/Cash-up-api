/**
 * Entidad de dominio: Deuda externa para nivel de endeudamiento.
 * Risk & Scoring
 */
export class ExternalDebt {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly creditorName: string,
    public readonly amount: number,
    public readonly monthlyPayment: number,
    public readonly recordedAt: Date,
  ) {}
}
