import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiDocsPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'offset',
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
    }),
  );
}
