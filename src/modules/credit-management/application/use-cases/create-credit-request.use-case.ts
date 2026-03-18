import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import { CREDIT_EVALUATION_REPOSITORY } from '../../../risk-scoring/application/ports/credit-evaluation.repository.port';
import type { CreditEvaluationRepositoryPort } from '../../../risk-scoring/application/ports/credit-evaluation.repository.port';

import type { ICreditRequestRepository } from '../../domain/repositories/credit-request.repository';
import { CREDIT_MANAGEMENT_TOKENS } from '../ports/tokens';
import type { CreateCreditRequestInput } from '../dtos/credit-request.dto';
import { CreditRequest } from '../../domain/entities/credit-request';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';

@Injectable()
export class CreateCreditRequestUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_EVALUATION_REPOSITORY)
    private readonly evaluationRepo: CreditEvaluationRepositoryPort,
    @Inject(CREDIT_MANAGEMENT_TOKENS.CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: ICreditRequestRepository,
  ) {}

  async execute(input: CreateCreditRequestInput) {
    const client = await this.clientRepo.findByUserId(input.userId);
    if (!client) {
      throw new NotFoundException(
        'Debes tener perfil de cliente antes de solicitar un préstamo.',
      );
    }

    const pending = await this.creditRequestRepo.findActivePendingByClientId(
      client.id,
    );
    if (pending) {
      throw new ConflictException('Ya tienes una solicitud pendiente de revisión.');
    }

    const evaluations = await this.evaluationRepo.findByClientId(client.id);
    const latest = evaluations[0];
    if (!latest) {
      throw new BadRequestException(
        'No hay evaluación de crédito. Completa tu perfil y evaluación inicial.',
      );
    }

    const req = new CreditRequest({
      clientId: client.id,
      requestedAmount: input.requestedAmount,
      termMonths: input.termMonths,
      currency: input.currency ?? 'PEN',
      purpose: input.purpose ?? null,
      clientNotes: input.clientNotes ?? null,
      evaluationId: latest.id,
      status: CreditRequestStatus.PENDING,
      reviewedByUserId: null,
      reviewedAt: null,
      rejectionReason: null,
      approvedAmount: null,
      approvedTermMonths: null,
      approvedInterestRate: null,
      approvedInterestType: null,
      loanId: null,
    });

    await this.creditRequestRepo.save(req);

    return {
      id: req.id,
      clientId: req.clientId,
      requestedAmount: Number(req.requestedAmount),
      termMonths: req.termMonths,
      currency: req.currency,
      purpose: req.purpose,
      status: req.status,
      evaluationId: req.evaluationId,
      createdAt: req.createdAt,
    };
  }
}

