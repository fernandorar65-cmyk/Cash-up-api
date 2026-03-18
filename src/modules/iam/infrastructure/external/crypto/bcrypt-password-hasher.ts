import * as bcrypt from 'bcrypt';
import type { PasswordHasherPort } from '../../../application/ports/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasherPort {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

