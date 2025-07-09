import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { FlashCard } from './entities/flash-card.entity';
import { FlashCardsRepository } from '@/repositories/flash-cards.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';

@Injectable()
export class FlashCardsService extends BaseServiceAbstract<FlashCard> {
  constructor(
    @Inject('FlashCardsRepositoryInterface')
    private readonly flashCardsRepository: FlashCardsRepository,
    @InjectQueue('image-optimize')
    private readonly imageOptimizeQueue: Queue,
  ) {
    super(flashCardsRepository);
  }

  async createFlashCard(
    createDto: CreateFlashCardDto,
    file: Express.Multer.File,
  ) {
    const flashCard = await this.flashCardsRepository.create(createDto);

    // Add Job to the image optimization queue
    await this.imageOptimizeQueue.add('optimize-size', {
      file,
      id: flashCard._id.toString(),
    });

    return flashCard;
  }
}
