/**
 * Entidad de dominio: Cargo adicional (comisión, seguro, gasto).
 * Credit Management. Mapeo TypeORM → tabla `loan_charges`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('loan_charges')
export class LoanCharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'loan_id' })
  loanId: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
