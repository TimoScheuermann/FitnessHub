import { createParamDecorator } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/IUser';

const FPUser = createParamDecorator((data, req) => req.user as IUser);

export default FPUser;
