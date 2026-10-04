import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserModel } from '../../../domain/common/models/authenticated-user.model';

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as AuthenticatedUserModel;
});
