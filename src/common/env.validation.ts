import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { skip } from 'node:test';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_URI: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
