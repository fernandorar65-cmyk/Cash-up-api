export class Role {
  constructor(params?: Partial<Role>) {
    Object.assign(this, params);
  }

  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

