import { Module } from '@nestjs/common';
import {
  LOAN_REPOSITORY,
  LOAN_REFINANCE_REPOSITORY,
  INSTALLMENT_REPOSITORY,
  LOAN_CHARGE_REPOSITORY,
  PENALTY_POLICY_REPOSITORY,
  LATE_FEE_REPOSITORY,
  LOAN_HISTORY_REPOSITORY,
} from './application/ports';
import { LoanRepository } from './infrastructure/persistence/loan.repository';
import { LoanRefinanceRepository } from './infrastructure/persistence/loan-refinance.repository';
import { InstallmentRepository } from './infrastructure/persistence/installment.repository';
import { LoanChargeRepository } from './infrastructure/persistence/loan-charge.repository';
import { PenaltyPolicyRepository } from './infrastructure/persistence/penalty-policy.repository';
import { LateFeeRepository } from './infrastructure/persistence/late-fee.repository';
import { LoanHistoryRepository } from './infrastructure/persistence/loan-history.repository';

@Module({
  providers: [
    { provide: LOAN_REPOSITORY, useClass: LoanRepository },
    { provide: LOAN_REFINANCE_REPOSITORY, useClass: LoanRefinanceRepository },
    { provide: INSTALLMENT_REPOSITORY, useClass: InstallmentRepository },
    { provide: LOAN_CHARGE_REPOSITORY, useClass: LoanChargeRepository },
    { provide: PENALTY_POLICY_REPOSITORY, useClass: PenaltyPolicyRepository },
    { provide: LATE_FEE_REPOSITORY, useClass: LateFeeRepository },
    { provide: LOAN_HISTORY_REPOSITORY, useClass: LoanHistoryRepository },
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
