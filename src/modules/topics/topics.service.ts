import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { Topic } from './entities/topic.entity';
import { TopicsRepository } from '@/repositories/topics.repository';

@Injectable()
export class TopicsService extends BaseServiceAbstract<Topic> {
  constructor(
    @Inject('TopicsRepositoryInterface')
    private readonly topicsRepository: TopicsRepository,
  ) {
    super(topicsRepository);
  }
}
