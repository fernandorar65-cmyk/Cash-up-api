export class LoanCharge {
  constructor(params?: Partial<LoanCharge>) {
    Object.assign(this, params);
  }

  id: string;
  loanId: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt: Date;
}

