import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientCreditProfile } from '../../domain/entities/client-credit-profile.entity';
import { CLIENT_CREDIT_PROFILE_REPOSITORY } from '../ports/client-credit-profile.repository.port';
import type { ClientCreditProfileRepositoryPort } from '../ports/client-credit-profile.repository.port';

@Injectable()
export class GetClientCreditProfileUseCase {
  constructor(
    @Inject(CLIENT_CREDIT_PROFILE_REPOSITORY)
    private readonly profileRepo: ClientCreditProfileRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<ClientCreditProfile> {
    const profile = await this.profileRepo.findByClientId(clientId);
    if (!profile) {
      throw new NotFoundException(
        `Perfil de crédito del cliente ${clientId} no encontrado`,
      );
    }
    return profile;
  }
}
