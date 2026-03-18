export class Loan {
  constructor(params?: Partial<Loan>) {
    Object.assign(this, params);
  }

  id: string;
  clientId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  interestType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

