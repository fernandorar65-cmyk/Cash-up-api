/**
 * Entidad de dominio: Asignación Usuario–Rol (N:N).
 * IAM / Users. Mapeo TypeORM → tabla `user_roles`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @Column({ type: 'timestamp', name: 'assigned_at' })
  assignedAt: Date;
}
