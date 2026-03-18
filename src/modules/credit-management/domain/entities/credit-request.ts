import type { CreditRequestStatus } from '../enums/credit-request-status.enum';

export class CreditRequest {
  constructor(params?: Partial<CreditRequest>) {
    Object.assign(this, params);
  }

  id: string;
  clientId: string;
  requestedAmount: number;
  termMonths: number;
  currency: string;
  purpose: string | null;
  clientNotes: string | null;
  evaluationId: string | null;
  status: CreditRequestStatus;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  approvedAmount: number | null;
  approvedTermMonths: number | null;
  approvedInterestRate: number | null;
  approvedInterestType: string | null;
  loanId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

