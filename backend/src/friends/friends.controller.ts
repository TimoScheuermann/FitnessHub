import {
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
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { FriendsService } from './friends.service';
import { IPendingFriendship } from './interfaces/IPendingFriendship';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getFriends(@FHUser() user: IUser): Promise<IUserInfo[]> {
    return this.friendsService.getFriendsOf(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('invitations')
  async getFriendInvitations(
    @FHUser() user: IUser,
  ): Promise<IPendingFriendship[]> {
    return this.friendsService.getInvitations(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('invite/:targetId')
  async inviteFriend(
    @FHUser() user,
    @Param('targetId') targetId: string,
  ): Promise<boolean> {
    return this.friendsService.sendInvitation(user._id, targetId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('accept/:friendshipId')
  async acceptFriend(
    @FHUser() user: IUser,
    @Param('friendshipId') friendshipId: string,
  ) {
    return this.friendsService.acceptFriendship(user._id, friendshipId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('deny/:friendshipId')
  async denyFriend(
    @FHUser() user: IUser,
    @Param('friendshipId') friendshipId: string,
  ) {
    return this.friendsService.denyFriendship(user._id, friendshipId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('remove/:friendId')
  async removeFriend(
    @FHUser() user: IUser,
    @Param('friendId') friendId: string,
  ) {
    return this.friendsService.deleteFriendship(user._id, friendId);
  }
}
