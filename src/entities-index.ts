/**
 * Índice de entidades de dominio para registro en TypeORM.
 * Una sola fuente: las entidades de cada contexto.
 */
import { UserOrmEntity } from './modules/iam/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from './modules/iam/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from './modules/iam/infrastructure/persistence/typeorm/entities/user-role.orm-entity';
import { Client } from './modules/risk-scoring/domain/entities/client.entity';
import { CreditEvaluation } from './modules/risk-scoring/domain/entities/credit-evaluation.entity';
import { CreditScoreHistory } from './modules/risk-scoring/domain/entities/credit-score-history.entity';
import { ClientBackgroundCheck } from './modules/risk-scoring/domain/entities/client-background-check.entity';
import { ExternalDebt } from './modules/risk-scoring/domain/entities/external-debt.entity';
import { ClientCreditProfile } from './modules/risk-scoring/domain/entities/client-credit-profile.entity';
import { LoanOrmEntity } from './modules/credit-management/infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { CreditRequestOrmEntity } from './modules/credit-management/infrastructure/persistence/typeorm/entities/credit-request.orm-entity';
import { InstallmentOrmEntity } from './modules/credit-management/infrastructure/persistence/typeorm/entities/installment.orm-entity';

export const typeOrmEntities = [
  UserOrmEntity,
  RoleOrmEntity,
  UserRoleOrmEntity,
  Client,
  CreditEvaluation,
  CreditScoreHistory,
  ClientBackgroundCheck,
  ExternalDebt,
  ClientCreditProfile,
  LoanOrmEntity,
  CreditRequestOrmEntity,
  InstallmentOrmEntity,
];
