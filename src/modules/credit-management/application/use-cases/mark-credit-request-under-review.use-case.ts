import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';

@Injectable()
export class MarkCreditRequestUnderReviewUseCase {
  constructor(
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
  ) {}

  async execute(params: { creditRequestId: string; reviewerUserId: string }) {
    const req = await this.creditRequestRepo.findById(params.creditRequestId);
    if (!req) throw new NotFoundException('Solicitud no encontrada.');

    if (req.status !== CreditRequestStatus.PENDING) {
      throw new ConflictException('Solo se pueden pasar a revisión solicitudes pendientes.');
    }

    req.status = CreditRequestStatus.UNDER_REVIEW;
    req.reviewedByUserId = params.reviewerUserId;
    req.reviewedAt = new Date();
    await this.creditRequestRepo.save(req);

    return { id: req.id, status: req.status, reviewedAt: req.reviewedAt };
  }
}

