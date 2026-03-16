/**
 * Entidad de dominio: Registro de auditoría.
 * Audit
 */
export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly action: string,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly oldValues: Record<string, unknown> | null,
    public readonly newValues: Record<string, unknown> | null,
    public readonly userId: string | null,
    public readonly ip: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: Date,
  ) {}
}
