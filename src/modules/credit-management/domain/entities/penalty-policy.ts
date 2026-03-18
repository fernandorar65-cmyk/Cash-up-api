export class PenaltyPolicy {
  constructor(params?: Partial<PenaltyPolicy>) {
    Object.assign(this, params);
  }

  id: string;
  name: string;
  penaltyPercentage: number;
  graceDays: number;
  calculationType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

