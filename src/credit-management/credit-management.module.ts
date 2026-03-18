import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from '../iam/iam.module';
import { RiskScoringModule } from '../risk-scoring/risk-scoring.module';
import { Loan } from './domain/entities/loan.entity';
import { CreditRequest } from './domain/entities/credit-request.entity';
import { LoanRefinance } from './domain/entities/loan-refinance.entity';
import { Installment } from './domain/entities/installment.entity';
import { LoanCharge } from './domain/entities/loan-charge.entity';
import { PenaltyPolicy } from './domain/entities/penalty-policy.entity';
import { LateFee } from './domain/entities/late-fee.entity';
import { LoanHistory } from './domain/entities/loan-history.entity';
import {
  LOAN_REPOSITORY,
  LOAN_REFINANCE_REPOSITORY,
  INSTALLMENT_REPOSITORY,
  LOAN_CHARGE_REPOSITORY,
  PENALTY_POLICY_REPOSITORY,
  LATE_FEE_REPOSITORY,
  LOAN_HISTORY_REPOSITORY,
  CREDIT_REQUEST_REPOSITORY,
} from './application/ports';
import { LoanRepository } from './infrastructure/persistence/loan.repository';
import { CreditRequestRepository } from './infrastructure/persistence/credit-request.repository';
import { LoanRefinanceRepository } from './infrastructure/persistence/loan-refinance.repository';
import { InstallmentRepository } from './infrastructure/persistence/installment.repository';
import { LoanChargeRepository } from './infrastructure/persistence/loan-charge.repository';
import { PenaltyPolicyRepository } from './infrastructure/persistence/penalty-policy.repository';
import { LateFeeRepository } from './infrastructure/persistence/late-fee.repository';
import { LoanHistoryRepository } from './infrastructure/persistence/loan-history.repository';
import { GetLoanUseCase } from './application/use-cases/get-loan.use-case';
import { ListLoansByClientUseCase } from './application/use-cases/list-loans-by-client.use-case';
import { ListLoansByStatusUseCase } from './application/use-cases/list-loans-by-status.use-case';
import { GetInstallmentUseCase } from './application/use-cases/get-installment.use-case';
import { ListInstallmentsByLoanUseCase } from './application/use-cases/list-installments-by-loan.use-case';
import { LoansController } from './presentation/loans.controller';
import { InstallmentsController } from './presentation/installments.controller';
import { CreditRequestsController } from './presentation/credit-requests.controller';
import { CreateCreditRequestUseCase } from './application/use-cases/create-credit-request.use-case';
import { ListMyCreditRequestsUseCase } from './application/use-cases/list-my-credit-requests.use-case';
import { ListPendingCreditRequestsUseCase } from './application/use-cases/list-pending-credit-requests.use-case';
import { GetCreditRequestUseCase } from './application/use-cases/get-credit-request.use-case';
import { RejectCreditRequestUseCase } from './application/use-cases/reject-credit-request.use-case';
import { ApproveCreditRequestUseCase } from './application/use-cases/approve-credit-request.use-case';

@Module({
  imports: [
    IamModule,
    RiskScoringModule,
    TypeOrmModule.forFeature([
      Loan,
      CreditRequest,
      LoanRefinance,
      Installment,
      LoanCharge,
      PenaltyPolicy,
      LateFee,
      LoanHistory,
    ]),
  ],
  controllers: [
    LoansController,
    InstallmentsController,
    CreditRequestsController,
  ],
  providers: [
    { provide: CREDIT_REQUEST_REPOSITORY, useClass: CreditRequestRepository },
    { provide: LOAN_REPOSITORY, useClass: LoanRepository },
    { provide: LOAN_REFINANCE_REPOSITORY, useClass: LoanRefinanceRepository },
    { provide: INSTALLMENT_REPOSITORY, useClass: InstallmentRepository },
    { provide: LOAN_CHARGE_REPOSITORY, useClass: LoanChargeRepository },
    { provide: PENALTY_POLICY_REPOSITORY, useClass: PenaltyPolicyRepository },
    { provide: LATE_FEE_REPOSITORY, useClass: LateFeeRepository },
    { provide: LOAN_HISTORY_REPOSITORY, useClass: LoanHistoryRepository },
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
    LOAN_REPOSITORY,
    LOAN_REFINANCE_REPOSITORY,
    INSTALLMENT_REPOSITORY,
    LOAN_CHARGE_REPOSITORY,
    PENALTY_POLICY_REPOSITORY,
    LATE_FEE_REPOSITORY,
    LOAN_HISTORY_REPOSITORY,
  ],
})
export class CreditManagementModule {}
