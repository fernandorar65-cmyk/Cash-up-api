export class LateFee {
  constructor(params?: Partial<LateFee>) {
    Object.assign(this, params);
  }

  id: string;
  installmentId: string;
  amount: number;
  appliedAt: Date;
  penaltyPolicyId: string;
}

