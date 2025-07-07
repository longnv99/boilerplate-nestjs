import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { UserRole } from './entities/user-role.entity';
import { UserRolesRepository } from '@/repositories/user-roles.repository';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { ERROR_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class UserRolesService extends BaseServiceAbstract<UserRole> {
  constructor(
    @Inject('UserRolesRepositoryInterface')
    private readonly userRolesRepository: UserRolesRepository,
  ) {
    super(userRolesRepository);
  }

  async create(createUserRoleDto: CreateUserRoleDto) {
    const exitedUserRole = await this.userRolesRepository.findOneByCondition({
      name: createUserRoleDto.name.toUpperCase(),
    });

    if (exitedUserRole) {
      throw new ConflictException({
        errorCode: ERROR_DICTIONARY.USER_ROLE_ALREADY_EXISTS,
        message: `Role ${createUserRoleDto.name.toUpperCase()} already exists.`,
      });
    }

    return this.userRolesRepository.create(createUserRoleDto);
  }
}
