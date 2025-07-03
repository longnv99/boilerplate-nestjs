import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './entities/collection.entity';
import { CollectionRepository } from '@/repositories/collection.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Collection.name,
        schema: CollectionSchema,
      },
    ]),
  ],
  controllers: [CollectionController],
  providers: [
    CollectionService,
    {
      provide: 'CollectionRepositoryInterface',
      useClass: CollectionRepository,
    },
  ],
})
export class CollectionModule {}
