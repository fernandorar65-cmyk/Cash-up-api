export class Installment {
  constructor(params?: Partial<Installment>) {
    Object.assign(this, params);
  }

  id: string;
  loanId: string;
  number: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  status: string;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

