import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import type { CreditRequestRepositoryPort } from '../../application/ports/credit-request.repository.port';

@Injectable()
export class CreditRequestRepository implements CreditRequestRepositoryPort {
  constructor(
    @InjectRepository(CreditRequest)
    private readonly repo: Repository<CreditRequest>,
  ) {}

  async findById(id: string): Promise<CreditRequest | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByClientId(clientId: string): Promise<CreditRequest[]> {
    return this.repo.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActivePendingByClientId(
    clientId: string,
  ): Promise<CreditRequest | null> {
    return this.repo
      .createQueryBuilder('cr')
      .where('cr.clientId = :clientId', { clientId })
      .andWhere('cr.status IN (:...st)', {
        st: [
          CreditRequestStatus.PENDING,
          CreditRequestStatus.UNDER_REVIEW,
        ],
      })
      .getOne();
  }

  async findByStatuses(statuses: string[]): Promise<CreditRequest[]> {
    if (statuses.length === 0) return [];
    return this.repo
      .createQueryBuilder('cr')
      .where('cr.status IN (:...statuses)', { statuses })
      .orderBy('cr.createdAt', 'ASC')
      .getMany();
  }

  async save(creditRequest: CreditRequest): Promise<void> {
    await this.repo.save(creditRequest);
  }
}
