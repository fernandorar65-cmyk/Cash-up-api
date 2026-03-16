import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  async findById(): Promise<User | null> {
    // Stub: sin lógica de negocio ni persistencia aún
    return null;
  }

  async findByEmail(): Promise<User | null> {
    return null;
  }

  async save(): Promise<void> {
    // Stub
  }
}
