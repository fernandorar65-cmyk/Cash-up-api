import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Installment } from '../../domain/entities/installment.entity';
import { INSTALLMENT_REPOSITORY } from '../ports/installment.repository.port';
import type { InstallmentRepositoryPort } from '../ports/installment.repository.port';

@Injectable()
export class GetInstallmentUseCase {
  constructor(
    @Inject(INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: InstallmentRepositoryPort,
  ) {}

  async execute(installmentId: string): Promise<Installment> {
    const installment = await this.installmentRepo.findById(installmentId);
    if (!installment) {
      throw new NotFoundException(
        `Cuota con id ${installmentId} no encontrada`,
      );
    }
    return installment;
  }
}
