import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionAction } from './domain/entities/collection-action.entity';
import { COLLECTION_ACTION_REPOSITORY } from './application/ports';
import { CollectionActionRepository } from './infrastructure/persistence/collection-action.repository';
import { GetCollectionActionUseCase } from './application/use-cases/get-collection-action.use-case';
import { ListCollectionActionsByClientUseCase } from './application/use-cases/list-collection-actions-by-client.use-case';
import { ListCollectionActionsByLoanUseCase } from './application/use-cases/list-collection-actions-by-loan.use-case';
import { CollectionActionsController } from './presentation/collection-actions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionAction])],
  controllers: [CollectionActionsController],
  providers: [
    {
      provide: COLLECTION_ACTION_REPOSITORY,
      useClass: CollectionActionRepository,
    },
    GetCollectionActionUseCase,
    ListCollectionActionsByClientUseCase,
    ListCollectionActionsByLoanUseCase,
  ],
  exports: [COLLECTION_ACTION_REPOSITORY],
})
export class CollectionModule {}
