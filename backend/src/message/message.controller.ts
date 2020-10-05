import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam, FriendsGuard } from 'src/friends/friends.guard';
import { IUser } from 'src/user/interfaces/IUser';
import { IMessage } from './interfaces/IMessage';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getMessages(@FHUser() user: IUser): Promise<IMessage[]> {
    return this.messageService.getMessages(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @FriendIDParam('to')
  @UseGuards(AuthGuard('jwt'), FriendsGuard)
  @Post(':to')
  async postMessage(
    @FHUser() from: IUser,
    @Param('to') to: string,
    @Body() body: { message: string },
  ): Promise<void> {
    this.messageService.sendMessage(from, to, body.message);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @FriendIDParam('friendId')
  @UseGuards(AuthGuard('jwt'), FriendsGuard)
  @Put('markAsRead/:friendId')
  async markAsRead(
    @FHUser() user: IUser,
    @Param('friendId') friendId: string,
  ): Promise<void> {
    this.messageService.markAsRead(user._id, friendId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('markBotAsRead')
  async markBotAsRead(@FHUser() user: IUser): Promise<void> {
    this.messageService.markAsRead(user._id, '5f4a1a372149ef521c108f4a');
  }
}
