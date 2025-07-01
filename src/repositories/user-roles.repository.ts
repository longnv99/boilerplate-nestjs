import {
  UserRole,
  UserRoleDocument,
} from '@/modules/user-roles/entities/user-role.entity';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRolesRepository extends BaseRepositoryAbstract<UserRoleDocument> {
  constructor(
    @InjectModel(UserRole.name)
    private readonly userRolesModel: Model<UserRoleDocument>,
  ) {
    super(userRolesModel);
  }
}
