import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../domain/entities/loan.entity';
import type { LoanRepositoryPort } from '../../application/ports/loan.repository.port';

@Injectable()
export class LoanRepository implements LoanRepositoryPort {
  constructor(
    @InjectRepository(Loan)
    private readonly repo: Repository<Loan>,
  ) {}

  async findById(id: string): Promise<Loan | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<Loan[]> {
    return this.repo.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Loan[]> {
    return this.repo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async save(loan: Loan): Promise<void> {
    await this.repo.save(loan);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
