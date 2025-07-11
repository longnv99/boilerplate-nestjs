import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';

export function configSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  app.use(
    ['/swagger'],
    expressBasicAuth({
      challenge: true,
      users: {
        [configService.get<string>('SWAGGER_USERNAME')]:
          configService.get<string>('SWAGGER_PASSWORD'),
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Boilerplate Project')
    .setDescription('## Boilerplate API documents')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
