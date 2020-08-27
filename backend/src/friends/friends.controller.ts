import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FPUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { UserService } from 'src/user/user.service';
import { FriendsService } from './friends.service';
import { IFriendship } from './interfaces/IFriendship';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getFriends(@FPUser() user: IUser): Promise<IUserInfo[]> {
    const friends: string[] = await this.friendsService.getFriendsOf(user._id);
    return Promise.all(
      friends.map(async x => await this.userService.getUserInfoById(x)),
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('invitations')
  async getFriendInvitations(@FPUser() user: IUser): Promise<IFriendship[]> {
    const data = await this.friendsService.getInvitations(user._id);
    return Promise.all(
      data.map(async x => {
        return {
          _id: x._id,
          invitee: x.invitee,
          target: x.target,
          accepted: x.accepted,
          inviteeUser: await this.userService.getUserInfoById(x.invitee),
          targetUser: await this.userService.getUserInfoById(x.target),
        };
      }),
    );
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @FriendIDParam('ids')
  // @UseGuards(AuthGuard('jwt'), FriendsGuard)
  // @Get('test/:id')
  // d() {
  //   return { a: 'YES' };
  // }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async inviteFriend(@FPUser() user, @Body() body: any): Promise<boolean> {
    return this.friendsService.sendInvitation(user._id, body.targetId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async acceptFriend(@Body() body: any) {
    return this.friendsService.acceptFriendship(body.friendshipId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('deny/:friendshipId')
  async denyFriend(@Param('friendshipId') friendshipId: string) {
    return this.friendsService.denyFriendship(friendshipId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('remove/:friendId')
  async removeFriend(
    @FPUser() user: IUser,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.deleteFriendship(user._id, friendId);
  }
}
