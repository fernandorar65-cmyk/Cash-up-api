import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from '../iam/iam.module';
import { RiskScoringModule } from '../risk-scoring/risk-scoring.module';

import { CREDIT_MANAGEMENT_TOKENS } from './application/ports/tokens';
import { LoanOrmEntity } from './infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { InstallmentOrmEntity } from './infrastructure/persistence/typeorm/entities/installment.orm-entity';
import { CreditRequestOrmEntity } from './infrastructure/persistence/typeorm/entities/credit-request.orm-entity';
import { TypeOrmLoanRepository } from './infrastructure/persistence/loan.repository';
import { TypeOrmInstallmentRepository } from './infrastructure/persistence/installment.repository';
import { TypeOrmCreditRequestRepository } from './infrastructure/persistence/credit-request.repository';

import { GetLoanUseCase } from './application/use-cases/get-loan.use-case';
import { ListLoansByClientUseCase } from './application/use-cases/list-loans-by-client.use-case';
import { ListLoansByStatusUseCase } from './application/use-cases/list-loans-by-status.use-case';
import { GetInstallmentUseCase } from './application/use-cases/get-installment.use-case';
import { ListInstallmentsByLoanUseCase } from './application/use-cases/list-installments-by-loan.use-case';
import { CreateCreditRequestUseCase } from './application/use-cases/create-credit-request.use-case';
import { ListMyCreditRequestsUseCase } from './application/use-cases/list-my-credit-requests.use-case';
import { ListPendingCreditRequestsUseCase } from './application/use-cases/list-pending-credit-requests.use-case';
import { GetCreditRequestUseCase } from './application/use-cases/get-credit-request.use-case';
import { RejectCreditRequestUseCase } from './application/use-cases/reject-credit-request.use-case';
import { ApproveCreditRequestUseCase } from './application/use-cases/approve-credit-request.use-case';

import { LoansController } from './presentation/controllers/loans.controller';
import { InstallmentsController } from './presentation/controllers/installments.controller';
import { CreditRequestsController } from './presentation/controllers/credit-requests.controller';

@Module({
  imports: [
    IamModule,
    RiskScoringModule,
    TypeOrmModule.forFeature([
      LoanOrmEntity,
      CreditRequestOrmEntity,
      InstallmentOrmEntity,
    ]),
  ],
  controllers: [LoansController, InstallmentsController, CreditRequestsController],
  providers: [
    {
      provide: CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY,
      useClass: TypeOrmCreditRequestRepository,
    },
    { provide: CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY, useClass: TypeOrmLoanRepository },
    {
      provide: CREDIT_MANAGEMENT_TOKENS.INSTALLMENT_REPOSITORY,
      useClass: TypeOrmInstallmentRepository,
    },
    GetLoanUseCase,
    ListLoansByClientUseCase,
    ListLoansByStatusUseCase,
    GetInstallmentUseCase,
    ListInstallmentsByLoanUseCase,
    CreateCreditRequestUseCase,
    ListMyCreditRequestsUseCase,
    ListPendingCreditRequestsUseCase,
    GetCreditRequestUseCase,
    RejectCreditRequestUseCase,
    ApproveCreditRequestUseCase,
  ],
  exports: [
    CREDIT_MANAGEMENT_TOKENS.LOAN_REPOSITORY,
    CREDIT_MANAGEMENT_TOKENS.INSTALLMENT_REPOSITORY,
    CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY,
  ],
})
export class CreditManagementModule {}

