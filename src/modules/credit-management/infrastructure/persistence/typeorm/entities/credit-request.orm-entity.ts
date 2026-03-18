import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreditRequestStatus } from '../../../../domain/enums/credit-request-status.enum';

@Entity('credit_requests')
export class CreditRequestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'requested_amount' })
  requestedAmount: number;

  @Column({ type: 'int', name: 'term_months' })
  termMonths: number;

  @Column({ type: 'varchar', length: 3, default: 'PEN' })
  currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  purpose: string | null;

  @Column({ type: 'text', name: 'client_notes', nullable: true })
  clientNotes: string | null;

  @Column({ type: 'uuid', name: 'evaluation_id', nullable: true })
  evaluationId: string | null;

  @Column({
    type: 'varchar',
    length: 30,
    default: CreditRequestStatus.PENDING,
  })
  status: CreditRequestStatus;

  @Column({ type: 'uuid', name: 'reviewed_by_user_id', nullable: true })
  reviewedByUserId: string | null;

  @Column({ type: 'timestamp', name: 'reviewed_at', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'text', name: 'rejection_reason', nullable: true })
  rejectionReason: string | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'approved_amount',
    nullable: true,
  })
  approvedAmount: number | null;

  @Column({ type: 'int', name: 'approved_term_months', nullable: true })
  approvedTermMonths: number | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'approved_interest_rate',
    nullable: true,
  })
  approvedInterestRate: number | null;

  @Column({ type: 'varchar', length: 50, name: 'approved_interest_type', nullable: true })
  approvedInterestType: string | null;

  @Column({ type: 'uuid', name: 'loan_id', nullable: true })
  loanId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

