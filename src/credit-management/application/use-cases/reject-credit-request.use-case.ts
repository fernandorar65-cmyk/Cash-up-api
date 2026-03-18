import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';
import type { RejectCreditRequestInput } from '../dto/credit-request.dto';

@Injectable()
export class RejectCreditRequestUseCase {
  constructor(
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
  ) {}

  async execute(input: RejectCreditRequestInput) {
    const req = await this.creditRequestRepo.findById(input.creditRequestId);
    if (!req) {
      throw new NotFoundException('Solicitud no encontrada.');
    }
    if (
      req.status !== CreditRequestStatus.PENDING &&
      req.status !== CreditRequestStatus.UNDER_REVIEW
    ) {
      throw new ConflictException(
        'Solo se pueden rechazar solicitudes pendientes o en revisión.',
      );
    }
    const reason = input.rejectionReason?.trim();
    if (!reason) {
      throw new BadRequestException('Indica el motivo del rechazo.');
    }

    req.status = CreditRequestStatus.REJECTED;
    req.rejectionReason = reason;
    req.reviewedByUserId = input.analystUserId;
    req.reviewedAt = new Date();

    await this.creditRequestRepo.save(req);

    return {
      id: req.id,
      status: req.status,
      rejectionReason: req.rejectionReason,
      reviewedAt: req.reviewedAt,
    };
  }
}
