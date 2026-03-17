/**
 * Entidad de dominio: Vinculación préstamo original → refinanciado.
 * Credit Management. Mapeo TypeORM → tabla `loan_refinances`.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('loan_refinances')
export class LoanRefinance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'original_loan_id' })
  originalLoanId: string;

  @Column({ type: 'uuid', name: 'new_loan_id' })
  newLoanId: string;

  @Column({ type: 'timestamp', name: 'refinanced_at' })
  refinancedAt: Date;
}
