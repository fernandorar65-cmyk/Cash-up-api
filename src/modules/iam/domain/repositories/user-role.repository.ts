import type { UserRole } from '../entities/user-role';

export interface IUserRoleRepository {
  findByUserId(userId: string): Promise<UserRole[]>;
  save(userRole: UserRole): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUserIdAndRoleId(userId: string, roleId: string): Promise<void>;
}

