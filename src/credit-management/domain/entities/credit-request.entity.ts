/**
 * Solicitud de crédito: lo que el cliente pide antes de existir un préstamo.
 * Al aprobar → se crea Loan + Installments y se enlaza loan_id.
 * Credit Management. Tabla `credit_requests`.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreditRequestStatus } from '../enums/credit-request-status.enum';

@Entity('credit_requests')
export class CreditRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Cliente que solicita (debe tener perfil y evaluación previa según reglas de negocio) */
  @Column({ type: 'uuid', name: 'client_id' })
  clientId: string;

  // --- Lo que pide el cliente (evaluación / decisión se basan en esto) ---
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'requested_amount' })
  requestedAmount: number;

  @Column({ type: 'int', name: 'term_months' })
  termMonths: number;

  @Column({ type: 'varchar', length: 3, default: 'PEN' })
  currency: string;

  /** Destino: personal, vehicular, etc. */
  @Column({ type: 'varchar', length: 100, nullable: true })
  purpose: string | null;

  /** Comentarios del solicitante */
  @Column({ type: 'text', name: 'client_notes', nullable: true })
  clientNotes: string | null;

  /**
   * Evaluación de riesgo vigente al momento de la solicitud (trazabilidad).
   * Opcional hasta que implementes el flujo que la asigne.
   */
  @Column({ type: 'uuid', name: 'evaluation_id', nullable: true })
  evaluationId: string | null;

  // --- Estado y decisión del analista ---
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

  /** Obligatorio si status = REJECTED */
  @Column({ type: 'text', name: 'rejection_reason', nullable: true })
  rejectionReason: string | null;

  /** Términos finales si difieren de lo solicitado (típico en aprobación) */
  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'approved_amount', nullable: true })
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

  /** Préstamo generado al aprobar (cronograma = installments de este loan) */
  @Column({ type: 'uuid', name: 'loan_id', nullable: true })
  loanId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
