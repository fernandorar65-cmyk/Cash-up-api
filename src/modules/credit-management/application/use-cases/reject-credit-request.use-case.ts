import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import type { RejectCreditRequestInput } from '../dtos/credit-request.dto';

@Injectable()
export class RejectCreditRequestUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
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

