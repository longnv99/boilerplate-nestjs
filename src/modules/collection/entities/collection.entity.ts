import { BaseEntity } from '@/modules/shared/base/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

export enum COLLECTION_LEVEL {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  CHAOS = 'CHAOS',
}

@Schema()
export class Collection extends BaseEntity {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: COLLECTION_LEVEL.EASY, enum: COLLECTION_LEVEL })
  level: COLLECTION_LEVEL;

  @Prop()
  order: number;

  @Prop()
  image: string;

  @Prop({ default: 0, min: 0 })
  totalFlashCards: number;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
