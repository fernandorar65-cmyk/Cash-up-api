export class UserRole {
  constructor(params?: Partial<UserRole>) {
    Object.assign(this, params);
  }

  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
}

