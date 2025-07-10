import { ConfigService } from '@nestjs/config';
import { HelmetOptions } from 'helmet';

const prodDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'"],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  frameSrc: ["'none'"],
};

const devDirectives = {
  ...prodDirectives,
  // Allow hot-reloading in mode development
  scriptSrc: ["'self'", "'unsafe-eval'"],
  // Allow WebSocket connections from dev server
  connectSrc: ["'self'", 'ws:', 'http:', 'https://api.your-service.com'],
};

export const helmetConfig = (configService: ConfigService): HelmetOptions => ({
  contentSecurityPolicy: {
    directives:
      configService.get<string>('NODE_ENV') === 'development'
        ? devDirectives
        : prodDirectives,
  },
});
