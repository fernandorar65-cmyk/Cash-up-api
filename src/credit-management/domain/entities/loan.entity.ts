/**
 * Entidad de dominio: Préstamo.
 * Credit Management. Mapeo TypeORM → tabla `loans`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate' })
  interestRate: number;

  @Column({ type: 'int', name: 'term_months' })
  termMonths: number;

  @Column({ type: 'varchar', length: 50, name: 'interest_type' })
  interestType: string;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
