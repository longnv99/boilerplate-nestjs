import { BaseEntity } from '@/modules/shared/base/base.entity';
import { BaseServiceInterface } from './base.interface.service';
import { FindAllResponse } from '@/types/common.type';
import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { FilterQuery, QueryOptions } from 'mongoose';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(dto: T | any): Promise<T> {
    return await this.repository.create(dto);
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    return await this.repository.update(id, item);
  }

  async remove(id: string): Promise<boolean> {
    return await this.repository.softDelete(id);
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(condition, options);
  }

  async findOne(id: string): Promise<T> {
    return await this.repository.findOneById(id);
  }

  async findOneByCondition(
    condition: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return await this.repository.findOneByCondition(condition, options);
  }
}
