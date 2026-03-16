import { UserRole } from '../../domain/entities/user-role.entity';

export const USER_ROLE_REPOSITORY = Symbol('UserRoleRepository');

export interface UserRoleRepositoryPort {
  findByUserId(userId: string): Promise<UserRole[]>;
  save(userRole: UserRole): Promise<void>;
  deleteByUserIdAndRoleId(userId: string, roleId: string): Promise<void>;
}
