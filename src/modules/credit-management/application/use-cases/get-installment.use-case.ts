import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { IInstallmentRepository } from '../../domain/repositories/installment.repository';

@Injectable()
export class GetInstallmentUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.INSTALLMENT_REPOSITORY)
    private readonly installmentRepo: IInstallmentRepository,
  ) {}

  async execute(installmentId: string) {
    const installment = await this.installmentRepo.findById(installmentId);
    if (!installment) {
      throw new NotFoundException(
        `Cuota con id ${installmentId} no encontrada`,
      );
    }
    return installment;
  }
}

