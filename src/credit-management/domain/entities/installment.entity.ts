/**
 * Entidad de dominio: Cuota del cronograma.
 * Credit Management. Mapeo TypeORM → tabla `installments`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'loan_id' })
  loanId: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'principal_amount' })
  principalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'interest_amount' })
  interestAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'timestamp', name: 'paid_at', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
