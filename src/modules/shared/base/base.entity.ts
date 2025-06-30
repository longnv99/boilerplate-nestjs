import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId;

  @Prop({ default: null })
  deletedAt?: Date;
}
