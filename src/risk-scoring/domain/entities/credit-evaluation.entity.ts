/**
 * Entidad de dominio: Evaluación de riesgo (puntaje, aprobado/rechazado, factores).
 * Risk & Scoring
 */
export class CreditEvaluation {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly score: number,
    public readonly approved: boolean,
    public readonly factors: Record<string, unknown>,
    public readonly evaluatedAt: Date,
    public readonly evaluatedByUserId: string | null,
  ) {}
}
