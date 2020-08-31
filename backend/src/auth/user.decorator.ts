import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/IUser';

const FHUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUser;
});

export default FHUser;
