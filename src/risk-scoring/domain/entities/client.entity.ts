/**
 * Entidad de dominio: Cliente (solicitante de préstamos).
 * Risk & Scoring
 */
export class Client {
  constructor(
    public readonly id: string,
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly monthlyIncome: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
