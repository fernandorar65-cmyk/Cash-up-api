import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_roles')
export class UserRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @Column({ type: 'timestamp', name: 'assigned_at' })
  assignedAt: Date;
}

