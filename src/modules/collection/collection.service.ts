import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { Collection } from './entities/collection.entity';
import { CollectionRepository } from '@/repositories/collection.repository';

@Injectable()
export class CollectionService extends BaseServiceAbstract<Collection> {
  constructor(
    @Inject('CollectionRepositoryInterface')
    private readonly collectionRepository: CollectionRepository,
  ) {
    super(collectionRepository);
  }
}
