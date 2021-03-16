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
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { FriendIDParam, FriendsGuard } from './friends.guard';
import { FriendsService } from './friends.service';
import { IPendingFriendship } from './interfaces/IPendingFriendship';

@ApiTags('Friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  /**
   * returns a list of friends of the request sender
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getFriends(@FHUser() user: IUser): Promise<IUserInfo[]> {
    return this.friendsService.getFriendsOf(user._id);
  }

  /**
   * returns more informations about a specific friends
   * @param id friend id
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @FriendIDParam('id')
  @UseGuards(AuthGuard('jwt'), FriendsGuard)
  @Get('info/:id')
  async getFriendInfo(@Param('id') id: string): Promise<any> {
    return this.friendsService.getFriendInformations(id);
  }

  /**
   * returns a list of unanswered friend-requests
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('invitations')
  async getFriendInvitations(
    @FHUser() user: IUser,
  ): Promise<IPendingFriendship[]> {
    return this.friendsService.getInvitations(user._id);
  }

  /**
   * Creates a new friend requests
   * @param user sender
   * @param targetId user id to invite
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('invite/:targetId')
  async inviteFriend(
    @FHUser() user: IUser,
    @Param('targetId') targetId: string,
  ): Promise<void> {
    this.friendsService.sendInvitation(user, targetId);
  }

  /**
   * accept a incoming friend request
   * @param user sender id
   * @param friendshipId string
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('accept/:friendshipId')
  async acceptFriend(
    @FHUser() user: IUser,
    @Param('friendshipId') friendshipId: string,
  ): Promise<void> {
    this.friendsService.acceptFriendship(user, friendshipId);
  }

  /**
   * denies a incoming friend request
   * @param user sender id
   * @param friendshipId string
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('deny/:friendshipId')
  async denyFriend(
    @FHUser() user: IUser,
    @Param('friendshipId') friendshipId: string,
  ): Promise<void> {
    this.friendsService.denyFriendship(user._id, friendshipId);
  }

  /**
   * removes a friend
   * @param user sender
   * @param friendId user id
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('remove/:friendId')
  async removeFriend(
    @FHUser() user: IUser,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    this.friendsService.deleteFriendship(user._id, friendId);
  }
}
