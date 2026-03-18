export class User {
  constructor(params?: Partial<User>) {
    Object.assign(this, params);
  }

  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

