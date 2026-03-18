import { Loan } from '../../../domain/entities/loan';
import { Installment } from '../../../domain/entities/installment';
import { CreditRequest } from '../../../domain/entities/credit-request';
import { LoanOrmEntity } from '../typeorm/entities/loan.orm-entity';
import { InstallmentOrmEntity } from '../typeorm/entities/installment.orm-entity';
import { CreditRequestOrmEntity } from '../typeorm/entities/credit-request.orm-entity';

export function toDomainLoan(e: LoanOrmEntity): Loan {
  return new Loan({
    id: e.id,
    clientId: e.clientId,
    amount: Number(e.amount),
    interestRate: Number(e.interestRate),
    termMonths: e.termMonths,
    interestType: e.interestType,
    status: e.status,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}

export function toOrmLoan(d: Loan): LoanOrmEntity {
  const e = new LoanOrmEntity();
  e.id = d.id;
  e.clientId = d.clientId;
  e.amount = d.amount;
  e.interestRate = d.interestRate;
  e.termMonths = d.termMonths;
  e.interestType = d.interestType;
  e.status = d.status;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function toDomainInstallment(e: InstallmentOrmEntity): Installment {
  return new Installment({
    id: e.id,
    loanId: e.loanId,
    number: e.number,
    dueDate: e.dueDate,
    principalAmount: Number(e.principalAmount),
    interestAmount: Number(e.interestAmount),
    totalAmount: Number(e.totalAmount),
    status: e.status,
    paidAt: e.paidAt,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}

export function toOrmInstallment(d: Installment): InstallmentOrmEntity {
  const e = new InstallmentOrmEntity();
  e.id = d.id;
  e.loanId = d.loanId;
  e.number = d.number;
  e.dueDate = d.dueDate;
  e.principalAmount = d.principalAmount;
  e.interestAmount = d.interestAmount;
  e.totalAmount = d.totalAmount;
  e.status = d.status;
  e.paidAt = d.paidAt;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function toDomainCreditRequest(e: CreditRequestOrmEntity): CreditRequest {
  return new CreditRequest({
    id: e.id,
    clientId: e.clientId,
    requestedAmount: Number(e.requestedAmount),
    termMonths: e.termMonths,
    currency: e.currency,
    purpose: e.purpose,
    clientNotes: e.clientNotes,
    evaluationId: e.evaluationId,
    status: e.status,
    reviewedByUserId: e.reviewedByUserId,
    reviewedAt: e.reviewedAt,
    rejectionReason: e.rejectionReason,
    approvedAmount: e.approvedAmount == null ? null : Number(e.approvedAmount),
    approvedTermMonths: e.approvedTermMonths,
    approvedInterestRate:
      e.approvedInterestRate == null ? null : Number(e.approvedInterestRate),
    approvedInterestType: e.approvedInterestType,
    loanId: e.loanId,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}

export function toOrmCreditRequest(d: CreditRequest): CreditRequestOrmEntity {
  const e = new CreditRequestOrmEntity();
  e.id = d.id;
  e.clientId = d.clientId;
  e.requestedAmount = d.requestedAmount;
  e.termMonths = d.termMonths;
  e.currency = d.currency;
  e.purpose = d.purpose;
  e.clientNotes = d.clientNotes;
  e.evaluationId = d.evaluationId;
  e.status = d.status;
  e.reviewedByUserId = d.reviewedByUserId;
  e.reviewedAt = d.reviewedAt;
  e.rejectionReason = d.rejectionReason;
  e.approvedAmount = d.approvedAmount;
  e.approvedTermMonths = d.approvedTermMonths;
  e.approvedInterestRate = d.approvedInterestRate;
  e.approvedInterestType = d.approvedInterestType;
  e.loanId = d.loanId;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

