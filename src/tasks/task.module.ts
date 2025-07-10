import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  providers: [TasksService],
})
export class TaskModule {}
