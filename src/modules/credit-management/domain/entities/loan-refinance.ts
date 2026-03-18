export class LoanRefinance {
  constructor(params?: Partial<LoanRefinance>) {
    Object.assign(this, params);
  }

  id: string;
  originalLoanId: string;
  newLoanId: string;
  refinancedAt: Date;
}

