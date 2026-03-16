import { Module } from '@nestjs/common';
import { COLLECTION_ACTION_REPOSITORY } from './application/ports';
import { CollectionActionRepository } from './infrastructure/persistence/collection-action.repository';

@Module({
  providers: [
    {
      provide: COLLECTION_ACTION_REPOSITORY,
      useClass: CollectionActionRepository,
    },
  ],
  exports: [COLLECTION_ACTION_REPOSITORY],
})
export class CollectionModule {}
