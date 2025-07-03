import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { FlashCard } from './entities/flash-card.entity';
import { FlashCardsRepository } from '@/repositories/flash-cards.repository';

@Injectable()
export class FlashCardsService extends BaseServiceAbstract<FlashCard> {
  constructor(
    @Inject('FlashCardsRepositoryInterface')
    private readonly flashCardsRepository: FlashCardsRepository,
  ) {
    super(flashCardsRepository);
  }
}
