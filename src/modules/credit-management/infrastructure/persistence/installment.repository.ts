import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IInstallmentRepository } from '../../domain/repositories/installment.repository';
import type { Installment } from '../../domain/entities/installment';
import { InstallmentOrmEntity } from './typeorm/entities/installment.orm-entity';
import { toDomainInstallment, toOrmInstallment } from './mappers/cm-persistence.mapper';

@Injectable()
export class TypeOrmInstallmentRepository implements IInstallmentRepository {
  constructor(
    @InjectRepository(InstallmentOrmEntity)
    private readonly repo: Repository<InstallmentOrmEntity>,
  ) {}

  async findById(id: string): Promise<Installment | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomainInstallment(e) : null;
  }

  async findByLoanId(loanId: string): Promise<Installment[]> {
    const list = await this.repo.find({
      where: { loanId },
      order: { number: 'ASC' },
    });
    return list.map(toDomainInstallment);
  }

  async save(installment: Installment): Promise<void> {
    await this.repo.save(toOrmInstallment(installment));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

