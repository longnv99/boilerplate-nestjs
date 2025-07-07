import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '@/repositories/users.repository';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { UserRolesService } from '../user-roles/user-roles.service';
import { USER_ROLE } from '../user-roles/entities/user-role.entity';
import { ERROR_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepository,
    private readonly userRolesService: UserRolesService,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto) {
    const userRole = await this.userRolesService.findOneByCondition({
      name: USER_ROLE.USER,
    });

    if (!userRole) {
      throw new InternalServerErrorException({
        errorCode: ERROR_DICTIONARY.USER_ROLE_NOT_FOUND,
        message: 'Default USER role not found. Please seed the database',
      });
    }

    return this.usersRepository.create({
      ...createUserDto,
      role: userRole._id,
    });
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneByCondition({ email });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async setCurrentRefreshToken(userId: string, hashedToken: string) {
    try {
      await this.usersRepository.update(userId, {
        currentRefreshToken: hashedToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserWithRole(userId: string): Promise<User> {
    try {
      return await this.usersRepository.getUserWithRole(userId);
    } catch (error) {
      throw error;
    }
  }
}
