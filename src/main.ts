import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from './configs/api-docs.config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const origin = configService.get<string>('CORS_ORIGIN') || '*';
  configSwagger(app, configService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: origin.includes(',')
      ? origin.split(',').map((item) => item.trim())
      : origin,
  });

  await app.listen(port);
}
bootstrap();
