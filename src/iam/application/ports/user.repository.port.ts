import { User } from '../../domain/entities/user.entity';

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
