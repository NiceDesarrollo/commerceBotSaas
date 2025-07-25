import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserFromToken {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  createdAt: Date;
}

export const User = createParamDecorator(
  (data: keyof UserFromToken | undefined, ctx: ExecutionContext): UserFromToken | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
); 