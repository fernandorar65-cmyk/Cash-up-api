/**
 * Entidad de dominio: Política de mora.
 * Credit Management. Mapeo TypeORM → tabla `penalty_policies`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('penalty_policies')
export class PenaltyPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'penalty_percentage' })
  penaltyPercentage: number;

  @Column({ type: 'int', name: 'grace_days' })
  graceDays: number;

  @Column({ type: 'varchar', length: 50, name: 'calculation_type' })
  calculationType: string;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
