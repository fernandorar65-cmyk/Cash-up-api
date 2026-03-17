import {
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity';
import { CLIENT_REPOSITORY } from '../ports/client.repository.port';
import type { ClientRepositoryPort } from '../ports/client.repository.port';
import type { CreateClientInput, CreateClientResult } from '../dto/create-client.dto';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(input: CreateClientInput): Promise<CreateClientResult> {
    const existingByUser = await this.clientRepo.findByUserId(input.userId);
    if (existingByUser) {
      throw new ConflictException(
        'Ya tienes un perfil de cliente. Puedes actualizarlo si lo necesitas.',
      );
    }

    const existingByDoc = await this.clientRepo.findByDocument(
      input.documentType,
      input.documentNumber,
    );
    if (existingByDoc) {
      throw new ConflictException(
        'Ya existe un cliente con ese tipo y número de documento.',
      );
    }

    const client = new Client();
    client.userId = input.userId;
    client.documentType = input.documentType;
    client.documentNumber = input.documentNumber;
    client.name = input.name;
    client.email = input.email;
    client.phone = input.phone;
    client.monthlyIncome = input.monthlyIncome;
    await this.clientRepo.save(client);

    return {
      id: client.id,
      documentType: client.documentType,
      documentNumber: client.documentNumber,
      name: client.name,
      email: client.email,
      phone: client.phone,
      monthlyIncome: client.monthlyIncome,
    };
  }
}
