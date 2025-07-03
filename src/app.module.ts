import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './common/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { UsersModule } from './modules/users/users.module';
import { TopicsModule } from './modules/topics/topics.module';
import { FlashCardsModule } from './modules/flash-cards/flash-cards.module';
import { CollectionModule } from './modules/collection/collection.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard } from './modules/auth/guards/jwt-access-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
      cache: true,
      expandVariables: true,
      validate: validateEnv,
      validationOptions: {
        abortedEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserRolesModule,
    UsersModule,
    TopicsModule,
    FlashCardsModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenGuard,
    },
  ],
})
export class AppModule {}
