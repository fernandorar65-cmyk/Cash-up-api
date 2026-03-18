/**
 * Índice de entidades de dominio para registro en TypeORM.
 * Una sola fuente: las entidades de cada contexto.
 */
import { User } from './iam/domain/entities/user.entity';
import { Role } from './iam/domain/entities/role.entity';
import { UserRole } from './iam/domain/entities/user-role.entity';
import { Client } from './risk-scoring/domain/entities/client.entity';
import { CreditEvaluation } from './risk-scoring/domain/entities/credit-evaluation.entity';
import { CreditScoreHistory } from './risk-scoring/domain/entities/credit-score-history.entity';
import { ClientBackgroundCheck } from './risk-scoring/domain/entities/client-background-check.entity';
import { ExternalDebt } from './risk-scoring/domain/entities/external-debt.entity';
import { ClientCreditProfile } from './risk-scoring/domain/entities/client-credit-profile.entity';
import { Loan } from './credit-management/domain/entities/loan.entity';
import { CreditRequest } from './credit-management/domain/entities/credit-request.entity';
import { LoanRefinance } from './credit-management/domain/entities/loan-refinance.entity';
import { Installment } from './credit-management/domain/entities/installment.entity';
import { LoanCharge } from './credit-management/domain/entities/loan-charge.entity';
import { PenaltyPolicy } from './credit-management/domain/entities/penalty-policy.entity';
import { LateFee } from './credit-management/domain/entities/late-fee.entity';
import { LoanHistory } from './credit-management/domain/entities/loan-history.entity';
import { Payment } from './payments/domain/entities/payment.entity';
import { PaymentApplication } from './payments/domain/entities/payment-application.entity';
import { CollectionAction } from './collection/domain/entities/collection-action.entity';
import { AuditLog } from './audit/domain/entities/audit-log.entity';

export const typeOrmEntities = [
  User,
  Role,
  UserRole,
  Client,
  CreditEvaluation,
  CreditScoreHistory,
  ClientBackgroundCheck,
  ExternalDebt,
  ClientCreditProfile,
  Loan,
  CreditRequest,
  LoanRefinance,
  Installment,
  LoanCharge,
  PenaltyPolicy,
  LateFee,
  LoanHistory,
  Payment,
  PaymentApplication,
  CollectionAction,
  AuditLog,
];
