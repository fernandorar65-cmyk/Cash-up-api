import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ILoanRepository } from '../../domain/repositories/loan.repository';
import type { Loan } from '../../domain/entities/loan';
import { LoanOrmEntity } from './typeorm/entities/loan.orm-entity';
import { toDomainLoan, toOrmLoan } from './mappers/cm-persistence.mapper';

@Injectable()
export class TypeOrmLoanRepository implements ILoanRepository {
  constructor(
    @InjectRepository(LoanOrmEntity)
    private readonly repo: Repository<LoanOrmEntity>,
  ) {}

  async findById(id: string): Promise<Loan | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomainLoan(e) : null;
  }

  async findByClientId(clientId: string): Promise<Loan[]> {
    const list = await this.repo.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
    return list.map(toDomainLoan);
  }

  async findByStatus(status: string): Promise<Loan[]> {
    const list = await this.repo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
    return list.map(toDomainLoan);
  }

  async save(loan: Loan): Promise<void> {
    await this.repo.save(toOrmLoan(loan));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

