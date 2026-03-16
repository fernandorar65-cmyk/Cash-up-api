/**
 * Entidad de dominio: Perfil actual (puntaje, nivel de riesgo, deuda, pagos a tiempo/atrasados).
 * Risk & Scoring
 */
export class ClientCreditProfile {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly currentScore: number,
    public readonly riskLevel: string,
    public readonly totalDebt: number,
    public readonly onTimePaymentsCount: number,
    public readonly latePaymentsCount: number,
    public readonly updatedAt: Date,
  ) {}
}
