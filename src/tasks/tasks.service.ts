import { UsersService } from '@/modules/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 0 * * *')
  async handleUpdateLeaderboard() {
    if (!Boolean(+this.configService.get<number>('JOB_ENABLED'))) {
      this.logger.log('Cron job disabled');
      return;
    }

    this.logger.log('Cron job "Update Leaderboard" running...');
    try {
      await this.userService.refreshLeaderboardCache();
      this.logger.log('Cron job "Update Leaderboard" completed successfully.');
    } catch (error) {
      this.logger.error('Failed to "Update Leaderboard"', error.stack);
    }
  }
}
