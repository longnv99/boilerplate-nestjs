import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { COLLECTION_LEVEL } from '../entities/collection.entity';
import { Type } from 'class-transformer';

export class FindAllCollectionDto {
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Limit cannot be less than 0' })
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit cannot be less than 1' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(COLLECTION_LEVEL)
  level?: COLLECTION_LEVEL;
}
