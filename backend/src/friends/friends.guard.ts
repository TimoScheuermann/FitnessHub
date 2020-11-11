import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IUser } from 'src/user/interfaces/IUser';
import { FriendsService } from './friends.service';

export const FriendIDParam = (id: string) => SetMetadata('friendIdParam', id);

@Injectable()
export class FriendsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly friendsService: FriendsService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const friendIdParam = this.reflector.get<string>(
      'friendIdParam',
      context.getHandler(),
    );

    // check if friendId Param ist set
    if (!friendIdParam) return false;

    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as Request;
    const user = req.user as IUser;
    const target = req.params[friendIdParam];

    // check if friendId Param is empty
    if (!target) return false;

    // check if user is in a friendship with XY
    return this.friendsService.doesFriendshipExist(user._id, target);
  }
}
