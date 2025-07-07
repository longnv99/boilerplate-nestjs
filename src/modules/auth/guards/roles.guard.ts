import { ERROR_DICTIONARY } from '@/constraints/error-dictionary.constraint';
import { ROLES } from '@/decorators/roles.decorator';
import { RequestWithUser } from '@/types/request.type';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const hasPermission = roles.includes(request.user.role.name);

    if (!hasPermission) {
      throw new ForbiddenException({
        errorCode: ERROR_DICTIONARY.USER_NOT_PERMISSION,
        message: 'You do not have permission to access this resource.',
      });
    }

    return true;
  }
}
