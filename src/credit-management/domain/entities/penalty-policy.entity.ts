/**
 * Entidad de dominio: Política de mora.
 * Credit Management
 */
export class PenaltyPolicy {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly penaltyPercentage: number,
    public readonly graceDays: number,
    public readonly calculationType: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
