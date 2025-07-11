import { UserRolesModule } from '@/modules/user-roles/user-roles.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Module({
  imports: [UsersModule, UserRolesModule],
  providers: [SeederService],
})
export class SeederModule {}
