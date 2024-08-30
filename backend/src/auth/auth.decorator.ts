import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const extractAccessToken = (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authorization = request.headers['authorization'];
  const [scheme, token] = (authorization ?? '').split(' ');
  return scheme === 'Bearer' ? token : null;
};

export const AccessToken = createParamDecorator(extractAccessToken);
