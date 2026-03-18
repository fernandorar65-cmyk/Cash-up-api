import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Loan } from '../../domain/entities/loan.entity';
import { Installment } from '../../domain/entities/installment.entity';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';
import { buildFrenchAmortizationSchedule } from '../services/installment-schedule.builder';
import type { ApproveCreditRequestInput } from '../dto/credit-request.dto';

const LOAN_STATUS_ACTIVE = 'ACTIVE';
const INSTALLMENT_STATUS_PENDING = 'PENDING';

@Injectable()
export class ApproveCreditRequestUseCase {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
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
      throw new BadRequestException('Indica el tipo de interés (ej. FIXED_ANNUAL).');
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

    const loan = new Loan();
    loan.clientId = req.clientId;
    loan.amount = amount;
    loan.interestRate = rate;
    loan.termMonths = term;
    loan.interestType = input.approvedInterestType.trim();
    loan.status = LOAN_STATUS_ACTIVE;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(loan);

      for (const row of schedule) {
        const inst = new Installment();
        inst.loanId = loan.id;
        inst.number = row.number;
        inst.dueDate = row.dueDate;
        inst.principalAmount = row.principalAmount;
        inst.interestAmount = row.interestAmount;
        inst.totalAmount = row.totalAmount;
        inst.status = INSTALLMENT_STATUS_PENDING;
        inst.paidAt = null;
        await manager.save(inst);
      }

      const fresh = await manager.findOne(CreditRequest, {
        where: { id: req.id },
      });
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
      await manager.save(fresh);
    });

    return {
      creditRequestId: req.id,
      loanId: loan.id,
      installmentsCount: schedule.length,
    };
  }
}
