/**
 * Entidad de dominio: Verificación externa (judicial, listas de riesgo, validaciones).
 * Risk & Scoring
 */
export class ClientBackgroundCheck {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly type: string,
    public readonly result: string,
    public readonly details: string | null,
    public readonly checkedAt: Date,
  ) {}
}
