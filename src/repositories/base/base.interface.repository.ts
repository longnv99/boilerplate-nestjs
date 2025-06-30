import { FindAllResponse } from '@/types/common.type';
import { FilterQuery, QueryOptions } from 'mongoose';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(id: string): Promise<T>;

  findOneByCondition(
    condition?: FilterQuery<T>,
    projection?: string,
    options?: QueryOptions,
  ): Promise<T>;

  findAll(
    condition?: FilterQuery<T>,
    projection?: string,
    options?: QueryOptions,
  ): Promise<FindAllResponse<T>>;

  update(id: string, dto: Partial<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
