import { FindAllResponse } from '@/types/common.type';
import { FilterQuery, QueryOptions } from 'mongoose';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(
    condition: FilterQuery<T>,
    projection?: string,
    options?: QueryOptions,
  ): Promise<FindAllResponse<T>>;
  findOne(id: string): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
