import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreditRequest } from '../../domain/entities/credit-request.entity';
import { CreditRequestStatus } from '../../domain/enums/credit-request-status.enum';
import { CLIENT_REPOSITORY } from '../../../risk-scoring/application/ports/client.repository.port';
import type { ClientRepositoryPort } from '../../../risk-scoring/application/ports/client.repository.port';
import { CREDIT_EVALUATION_REPOSITORY } from '../../../risk-scoring/application/ports/credit-evaluation.repository.port';
import type { CreditEvaluationRepositoryPort } from '../../../risk-scoring/application/ports/credit-evaluation.repository.port';
import { CREDIT_REQUEST_REPOSITORY } from '../ports/credit-request.repository.port';
import type { CreditRequestRepositoryPort } from '../ports/credit-request.repository.port';
import type {
  CreateCreditRequestInput,
  CreateCreditRequestResult,
} from '../dto/credit-request.dto';

@Injectable()
export class CreateCreditRequestUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
    @Inject(CREDIT_EVALUATION_REPOSITORY)
    private readonly evaluationRepo: CreditEvaluationRepositoryPort,
    @Inject(CREDIT_REQUEST_REPOSITORY)
    private readonly creditRequestRepo: CreditRequestRepositoryPort,
  ) {}

  async execute(
    input: CreateCreditRequestInput,
  ): Promise<CreateCreditRequestResult> {
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
      throw new ConflictException(
        'Ya tienes una solicitud pendiente de revisión.',
      );
    }

    const evaluations = await this.evaluationRepo.findByClientId(client.id);
    const latest = evaluations[0];
    if (!latest) {
      throw new BadRequestException(
        'No hay evaluación de crédito. Completa tu perfil y evaluación inicial.',
      );
    }

    const req = new CreditRequest();
    req.clientId = client.id;
    req.requestedAmount = input.requestedAmount;
    req.termMonths = input.termMonths;
    req.currency = input.currency ?? 'PEN';
    req.purpose = input.purpose ?? null;
    req.clientNotes = input.clientNotes ?? null;
    req.evaluationId = latest.id;
    req.status = CreditRequestStatus.PENDING;
    req.reviewedByUserId = null;
    req.reviewedAt = null;
    req.rejectionReason = null;
    req.approvedAmount = null;
    req.approvedTermMonths = null;
    req.approvedInterestRate = null;
    req.approvedInterestType = null;
    req.loanId = null;

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
