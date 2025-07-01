import { User, UserDocument } from '@/modules/users/entities/user.entity';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { UserRepositoryInterface } from '@/modules/users/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '@/modules/user-roles/entities/user-role.entity';

export class UsersRepository
  extends BaseRepositoryAbstract<UserDocument>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly usersRepository: Model<UserDocument>,
  ) {
    super(usersRepository);
  }

  async getUserWithRole(userId: string): Promise<User> {
    return this.usersRepository.findById(userId).populate('role').exec();
  }
}
