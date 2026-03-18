export class LoanHistory {
  constructor(params?: Partial<LoanHistory>) {
    Object.assign(this, params);
  }

  id: string;
  loanId: string;
  action: string;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown> | null;
  userId: string;
  createdAt: Date;
}

