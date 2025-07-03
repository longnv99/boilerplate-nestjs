import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Topic, TopicDocument } from '@/modules/topics/entities/topic.entity';
import { TopicsRepositoryInterface } from '@/modules/topics/interface/topics.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TopicsRepository
  extends BaseRepositoryAbstract<TopicDocument>
  implements TopicsRepositoryInterface
{
  constructor(
    @InjectModel(Topic.name)
    private readonly topicsModel: Model<TopicDocument>,
  ) {
    super(topicsModel);
  }
}
