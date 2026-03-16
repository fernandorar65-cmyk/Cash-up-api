import { PenaltyPolicy } from '../../domain/entities/penalty-policy.entity';

export const PENALTY_POLICY_REPOSITORY = Symbol('PenaltyPolicyRepository');

export interface PenaltyPolicyRepositoryPort {
  findById(id: string): Promise<PenaltyPolicy | null>;
  findAllActive(): Promise<PenaltyPolicy[]>;
  save(penaltyPolicy: PenaltyPolicy): Promise<void>;
}
