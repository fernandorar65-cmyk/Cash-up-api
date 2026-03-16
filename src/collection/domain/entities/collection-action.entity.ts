/**
 * Entidad de dominio: Gestión de cobranza.
 * Collection / Debt Recovery
 */
export class CollectionAction {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly loanId: string | null,
    public readonly actionType: string,
    public readonly result: string,
    public readonly notes: string | null,
    public readonly performedAt: Date,
    public readonly performedByUserId: string,
  ) {}
}
