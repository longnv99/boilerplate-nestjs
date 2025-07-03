import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import {
  FlashCard,
  FlashCardDocument,
} from '@/modules/flash-cards/entities/flash-card.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlashCardsRepositoryInterface } from '@/modules/flash-cards/interface/flash-cards.interface';

@Injectable()
export class FlashCardsRepository
  extends BaseRepositoryAbstract<FlashCardDocument>
  implements FlashCardsRepositoryInterface
{
  constructor(
    @InjectModel(FlashCard.name)
    private readonly flashCardsModel: Model<FlashCardDocument>,
  ) {
    super(flashCardsModel);
  }
}
