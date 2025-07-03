import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import {
  Collection,
  CollectionDocument,
} from '@/modules/collection/entities/collection.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionRepositoryInterface } from '@/modules/collection/interface/collection.interface';

@Injectable()
export class CollectionRepository
  extends BaseRepositoryAbstract<CollectionDocument>
  implements CollectionRepositoryInterface
{
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
  ) {
    super(collectionModel);
  }
}
