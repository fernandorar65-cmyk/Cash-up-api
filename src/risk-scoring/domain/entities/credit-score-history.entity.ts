/**
 * Entidad de dominio: Historial del puntaje del cliente en el tiempo.
 * Risk & Scoring
 */
export class CreditScoreHistory {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly score: number,
    public readonly recordedAt: Date,
  ) {}
}
