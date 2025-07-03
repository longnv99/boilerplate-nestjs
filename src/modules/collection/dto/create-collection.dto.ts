import { User } from '@/modules/users/entities/user.entity';
import { COLLECTION_LEVEL } from '../entities/collection.entity';
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  description: string;

  @IsEnum(COLLECTION_LEVEL)
  level: COLLECTION_LEVEL;

  @IsOptional()
  image: string;

  @IsOptional()
  @IsBooleanString()
  isPublic: boolean;

  user?: User;
}
