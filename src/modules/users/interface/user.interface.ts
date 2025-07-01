import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { User, UserDocument } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<UserDocument> {
  getUserWithRole(userId: string): Promise<User>;
}
