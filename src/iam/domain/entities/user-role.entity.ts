/**
 * Entidad de dominio: Asignación Usuario–Rol (N:N).
 * IAM / Users
 */
export class UserRole {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roleId: string,
    public readonly assignedAt: Date,
  ) {}
}
