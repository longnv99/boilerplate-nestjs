import { User } from '@/modules/users/entities/user.entity';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFlashCardDto {
  @IsNotEmpty()
  vocabulary: string;

  image: string;

  @IsNotEmpty()
  definition: string;

  @IsNotEmpty()
  meaning: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  examples?: string[];

  @IsOptional()
  pronunciation: string;

  user?: User;
}
