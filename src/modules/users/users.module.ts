import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserSchemaFactory } from './entities/user.entity';
import {
  FlashCard,
  FlashCardSchema,
} from '../flash-cards/entities/flash-card.entity';
import {
  Collection,
  CollectionSchema,
} from '../collection/entities/collection.entity';
import { UsersRepository } from '@/repositories/users.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        inject: [getModelToken(FlashCard.name), getModelToken(Collection.name)],
        imports: [
          MongooseModule.forFeature([
            { name: FlashCard.name, schema: FlashCardSchema },
            { name: Collection.name, schema: CollectionSchema },
          ]),
        ],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'UsersRepositoryInterface', useClass: UsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
