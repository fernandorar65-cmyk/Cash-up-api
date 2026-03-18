import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';

@Injectable()
export class CancelCreditRequestUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
  ) {}

  async execute(params: { creditRequestId: string; requesterUserId: string }) {
    const req = await this.creditRequestRepo.findById(params.creditRequestId);
    if (!req) throw new NotFoundException('Solicitud no encontrada.');

    const client = await this.clientRepo.findByUserId(params.requesterUserId);
    if (!client || client.id !== req.clientId) {
      throw new ForbiddenException('No puedes cancelar esta solicitud.');
    }

    if (
      req.status !== CreditRequestStatus.PENDING &&
      req.status !== CreditRequestStatus.UNDER_REVIEW
    ) {
      throw new ConflictException('Solo se pueden cancelar solicitudes pendientes o en revisión.');
    }

    req.status = CreditRequestStatus.CANCELLED;
    await this.creditRequestRepo.save(req);
    return { id: req.id, status: req.status };
  }
}

