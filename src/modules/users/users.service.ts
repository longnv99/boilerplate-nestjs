import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from '@/repositories/users.repository';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
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
}
