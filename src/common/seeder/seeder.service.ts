import { UserRolesService } from '@/modules/user-roles/user-roles.service';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import rolesData from './data/roles.seed.json';
import usersData from './data/users.seed.json';
import { CreateUserRoleDto } from '@/modules/user-roles/dto/create-user-role.dto';
import { hashContent } from '@/helpers/utils';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding data...');
    await this.seedRoles();
    await this.seedAdminUser();
    this.logger.log('Seeding completed!');
  }

  private async seedRoles() {
    this.logger.log('Seeding Roles...');
    for (const role of rolesData) {
      const roleExists = await this.userRolesService.findOneByCondition({
        name: role.name,
      });

      if (!roleExists) {
        await this.userRolesService.create(role as CreateUserRoleDto);
      }
    }
  }

  private async seedAdminUser() {
    this.logger.log('Seeding Admin Account...');
    for (const user of usersData) {
      const adminExists = await this.usersService.findOneByCondition({
        email: user.email,
      });

      if (!adminExists) {
        const adminRole = await this.userRolesService.findOneByCondition({
          name: user.roleName,
        });

        if (!adminRole) {
          this.logger.error(
            `Role ${user.roleName} not found. Please ensure roles are seeded first.`,
          );
          continue;
        }

        const hashedPassword = await hashContent(user.password);
        await this.usersService.createSeedUser({
          ...user,
          password: hashedPassword,
          role: adminRole._id,
        });
      }
    }
  }
}
