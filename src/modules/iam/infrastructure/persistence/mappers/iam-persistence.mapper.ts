import { User } from '../../../domain/entities/user';
import { Role } from '../../../domain/entities/role';
import { UserRole } from '../../../domain/entities/user-role';
import { UserOrmEntity } from '../typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../typeorm/entities/role.orm-entity';
import { UserRoleOrmEntity } from '../typeorm/entities/user-role.orm-entity';

export function toDomainUser(e: UserOrmEntity): User {
  return new User({
    id: e.id,
    email: e.email,
    name: e.name,
    passwordHash: e.passwordHash,
    isActive: e.isActive,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}

export function toOrmUser(d: User): UserOrmEntity {
  const e = new UserOrmEntity();
  e.id = d.id;
  e.email = d.email;
  e.name = d.name;
  e.passwordHash = d.passwordHash;
  e.isActive = d.isActive;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function toDomainRole(e: RoleOrmEntity): Role {
  return new Role({
    id: e.id,
    name: e.name,
    description: e.description ?? '',
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
}

export function toOrmRole(d: Role): RoleOrmEntity {
  const e = new RoleOrmEntity();
  e.id = d.id;
  e.name = d.name;
  e.description = d.description;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function toDomainUserRole(e: UserRoleOrmEntity): UserRole {
  return new UserRole({
    id: e.id,
    userId: e.userId,
    roleId: e.roleId,
    assignedAt: e.assignedAt,
  });
}

export function toOrmUserRole(d: UserRole): UserRoleOrmEntity {
  const e = new UserRoleOrmEntity();
  e.id = d.id;
  e.userId = d.userId;
  e.roleId = d.roleId;
  e.assignedAt = d.assignedAt;
  return e;
}

