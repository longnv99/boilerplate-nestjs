import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { UserDocument } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<UserDocument> {}
