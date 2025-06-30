import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { BaseRepositoryInterface } from './base.interface.repository';
import { BaseEntity } from '@/modules/shared/base/base.entity';
import { FindAllResponse } from '@/types/common.type';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {}

  async create(dto: T | any): Promise<T> {
    const createData = new this.model(dto);
    return await createData.save();
  }

  async findOneById(id: string): Promise<T> {
    const item = await this.model.findById(id);
    return item.deletedAt ? null : item;
  }

  async findOneByCondition(
    condition?: object,
    projection?: string,
    options?: QueryOptions,
  ): Promise<T> {
    return await this.model
      .findOne({ ...condition, deletedAt: null }, projection, options)
      .exec();
  }

  async findAll(
    condition: FilterQuery<T>,
    projection?: string,
    options?: QueryOptions,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...condition, deletedAt: null }),
      this.model.find({ ...condition, deletedAt: null }, projection, options),
    ]);
    return {
      count,
      items,
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    return await this.model
      .findByIdAndUpdate({ _id: id, deletedAt: null }, dto, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }

    return !!(await this.model.findByIdAndUpdate<T>(id, {
      deleteAt: new Date(),
    }));
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
