export interface CreateCreditRequestInput {
  userId: string;
  requestedAmount: number;
  termMonths: number;
  currency?: string;
  purpose?: string | null;
  clientNotes?: string | null;
}

export interface CreateCreditRequestResult {
  id: string;
  clientId: string;
  requestedAmount: number;
  termMonths: number;
  currency: string;
  purpose: string | null;
  status: string;
  evaluationId: string | null;
  createdAt: Date;
}

export interface ApproveCreditRequestInput {
  creditRequestId: string;
  analystUserId: string;
  approvedAmount: number;
  approvedTermMonths: number;
  approvedInterestRate: number;
  approvedInterestType: string;
  /** Primera fecha de vencimiento (opcional; por defecto +1 mes) */
  firstInstallmentDueDate?: Date;
}

export interface ApproveCreditRequestResult {
  creditRequestId: string;
  loanId: string;
  installmentsCount: number;
}

export interface RejectCreditRequestInput {
  creditRequestId: string;
  analystUserId: string;
  rejectionReason: string;
}
