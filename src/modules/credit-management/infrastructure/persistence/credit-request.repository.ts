import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import type { CreditRequest } from '../../domain/entities/credit-request';
import type { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CreditRequestOrmEntity } from './typeorm/entities/credit-request.orm-entity';
import { toDomainCreditRequest, toOrmCreditRequest } from './mappers/cm-persistence.mapper';

@Injectable()
export class TypeOrmCreditRequestRepository implements ICreditRequestRepository {
  constructor(
    @InjectRepository(CreditRequestOrmEntity)
    private readonly repo: Repository<CreditRequestOrmEntity>,
  ) {}

  async findById(id: string): Promise<CreditRequest | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? toDomainCreditRequest(e) : null;
  }

  async findByClientId(clientId: string): Promise<CreditRequest[]> {
    const list = await this.repo.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
    return list.map(toDomainCreditRequest);
  }

  async findActivePendingByClientId(clientId: string): Promise<CreditRequest | null> {
    const e = await this.repo
      .createQueryBuilder('cr')
      .where('cr.clientId = :clientId', { clientId })
      .andWhere('cr.status IN (:...st)', {
        st: ['PENDING', 'UNDER_REVIEW'],
      })
      .getOne();
    return e ? toDomainCreditRequest(e) : null;
  }

  async findByStatuses(statuses: CreditRequestStatus[]): Promise<CreditRequest[]> {
    if (statuses.length === 0) return [];
    const list = await this.repo
      .createQueryBuilder('cr')
      .where('cr.status IN (:...statuses)', { statuses })
      .orderBy('cr.createdAt', 'ASC')
      .getMany();
    return list.map(toDomainCreditRequest);
  }

  async save(req: CreditRequest): Promise<void> {
    await this.repo.save(toOrmCreditRequest(req));
  }
}

