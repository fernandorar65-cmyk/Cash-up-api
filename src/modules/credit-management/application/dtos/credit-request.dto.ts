export interface CreateCreditRequestInput {
  userId: string;
  requestedAmount: number;
  termMonths: number;
  currency?: string;
  purpose?: string | null;
  clientNotes?: string | null;
}

export interface RejectCreditRequestInput {
  creditRequestId: string;
  analystUserId: string;
  rejectionReason: string;
}

export interface ApproveCreditRequestInput {
  creditRequestId: string;
  analystUserId: string;
  approvedAmount: number;
  approvedTermMonths: number;
  approvedInterestRate: number;
  approvedInterestType: string;
  firstInstallmentDueDate?: Date;
}

