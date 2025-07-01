import { BaseEntity } from '@/modules/shared/base/base.entity';
import { UserRole } from '@/modules/user-roles/entities/user-role.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Address, AddressSchema } from './address.entity';
import { FlashCardDocument } from '@/modules/flash-cards/entities/flash-card.entity';
import { CollectionDocument } from '@/modules/collection/entities/collection.entity';
import { NextFunction } from 'express';
import { Exclude, Transform, Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export enum LANGUAGES {
  ENGLISH = 'English',
  FRENCH = 'French',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  SPANISH = 'Spanish',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true, // update data when get from DB
    virtuals: true,
  },
})
export class User extends BaseEntity {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (firstName: string) => firstName.trim(),
  })
  firstName: string;

  @Prop({ required: true, set: (lastName: string) => lastName.trim() })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({
    match: /^([+]\d{2})?\d{10}$/,
    get: (phoneNumber: string) => {
      if (!phoneNumber) return;

      const lastThreeDigits = phoneNumber.slice(phoneNumber.length - 4);
      return `****-****-${lastThreeDigits}`;
    },
  })
  phoneNumber: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  @Exclude()
  password: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({
    enum: GENDER,
  })
  gender: string;

  @Prop({ default: 0 })
  point: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.name,
  })
  @Type(() => UserRole)
  @Transform((value) => value.obj.role?.name, { toClassOnly: true })
  role: UserRole;

  @Prop()
  headline: string;

  @Prop()
  friendlyId: number;

  @Prop({
    type: [
      {
        type: AddressSchema,
      },
    ],
  })
  @Type(() => Address)
  address: Address[];

  defaultAddress?: string;

  @Prop()
  @Exclude()
  currentRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (
  flashCardModel: Model<FlashCardDocument>,
  collectionModal: Model<CollectionDocument>,
) => {
  const userSchema = UserSchema;

  userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
    // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
    const user = await this.model.findOne(this.getFilter());

    await Promise.all([
      flashCardModel.deleteMany({ user: user._id }).exec(),
      collectionModal.deleteMany({ user: user._id }).exec(),
    ]);

    return next();
  });

  // Define virtual property
  // 'default_address' is not stored in the DB but is calculated when you query it.
  userSchema.virtual('defaultAddress').get(function (this: UserDocument) {
    if (this.address.length) {
      return `${(this.address[0].street && ' ') || ''}${this.address[0].city} ${
        this.address[0].state
      } ${this.address[0].country}`;
    }
  });

  return userSchema;
};
