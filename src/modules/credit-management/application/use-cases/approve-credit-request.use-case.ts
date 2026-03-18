import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import type { ApproveCreditRequestInput } from '../dtos/credit-request.dto';
import { buildFrenchAmortizationSchedule } from '../services/installment-schedule.builder';

import { LoanOrmEntity } from '../../infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { InstallmentOrmEntity } from '../../infrastructure/persistence/typeorm/entities/installment.orm-entity';
import { CreditRequestOrmEntity } from '../../infrastructure/persistence/typeorm/entities/credit-request.orm-entity';

const LOAN_STATUS_ACTIVE = 'ACTIVE';
const INSTALLMENT_STATUS_PENDING = 'PENDING';

@Injectable()
export class ApproveCreditRequestUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(input: ApproveCreditRequestInput) {
    const req = await this.creditRequestRepo.findById(input.creditRequestId);
    if (!req) {
      throw new NotFoundException('Solicitud no encontrada.');
    }
    if (
      req.status !== CreditRequestStatus.PENDING &&
      req.status !== CreditRequestStatus.UNDER_REVIEW
    ) {
      throw new ConflictException(
        'Solo se pueden aprobar solicitudes pendientes o en revisión.',
      );
    }

    const amount = input.approvedAmount;
    const term = input.approvedTermMonths;
    const rate = input.approvedInterestRate;

    if (amount <= 0 || term <= 0 || rate < 0) {
      throw new BadRequestException(
        'Monto y plazo deben ser positivos; tasa no negativa.',
      );
    }
    if (!input.approvedInterestType?.trim()) {
      throw new BadRequestException(
        'Indica el tipo de interés (ej. FIXED_ANNUAL).',
      );
    }

    const firstDue =
      input.firstInstallmentDueDate ??
      (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
      })();

    const schedule = buildFrenchAmortizationSchedule({
      principal: amount,
      annualInterestRatePercent: rate,
      termMonths: term,
      firstDueDate: firstDue,
    });

    if (schedule.length !== term) {
      throw new BadRequestException('No se pudo generar el cronograma de cuotas.');
    }

    const loan = new LoanOrmEntity();
    loan.clientId = req.clientId;
    loan.amount = amount;
    loan.interestRate = rate;
    loan.termMonths = term;
    loan.interestType = input.approvedInterestType.trim();
    loan.status = LOAN_STATUS_ACTIVE;

    await this.dataSource.transaction(async (manager) => {
      const loanRepo = manager.getRepository(LoanOrmEntity);
      const instRepo = manager.getRepository(InstallmentOrmEntity);
      const crRepo = manager.getRepository(CreditRequestOrmEntity);

      await loanRepo.save(loan);

      for (const row of schedule) {
        const inst = new InstallmentOrmEntity();
        inst.loanId = loan.id;
        inst.number = row.number;
        inst.dueDate = row.dueDate;
        inst.principalAmount = row.principalAmount;
        inst.interestAmount = row.interestAmount;
        inst.totalAmount = row.totalAmount;
        inst.status = INSTALLMENT_STATUS_PENDING;
        inst.paidAt = null;
        await instRepo.save(inst);
      }

      const fresh = await crRepo.findOne({ where: { id: req.id } });
      if (!fresh) throw new Error('Solicitud perdida en transacción');
      fresh.status = CreditRequestStatus.APPROVED;
      fresh.reviewedByUserId = input.analystUserId;
      fresh.reviewedAt = new Date();
      fresh.rejectionReason = null;
      fresh.approvedAmount = amount;
      fresh.approvedTermMonths = term;
      fresh.approvedInterestRate = rate;
      fresh.approvedInterestType = input.approvedInterestType.trim();
      fresh.loanId = loan.id;
      await crRepo.save(fresh);
    });

    return {
      creditRequestId: req.id,
      loanId: loan.id,
      installmentsCount: schedule.length,
    };
  }
}

