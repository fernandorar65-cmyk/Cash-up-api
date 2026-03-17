import { Role } from '../../domain/entities/role.entity';

export const ROLE_REPOSITORY = Symbol('RoleRepository');

export interface RoleRepositoryPort {
  findById(id: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  save(role: Role): Promise<void>;
  delete(id: string): Promise<void>;
}
