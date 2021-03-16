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
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam, FriendsGuard } from 'src/friends/friends.guard';
import { FHBot } from 'src/user/FHBot.user';
import { IUser } from 'src/user/interfaces/IUser';
import { IMessage } from './interfaces/IMessage';
import { MessageService } from './message.service';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * returns all message send or received by the sender
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getMessages(@FHUser() user: IUser): Promise<IMessage[]> {
    return this.messageService.getMessages(user._id);
  }

  /**
   * sends a new message
   * @param from sender user
   * @param to friendId string
   * @param body message
   */
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

  /**
   * marks a message as read
   * @param user request sender
   * @param friendId message sender
   */
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

  /**
   * marks a message send by the system as read
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('markBotAsRead')
  async markBotAsRead(@FHUser() user: IUser): Promise<void> {
    this.messageService.markAsRead(user._id, FHBot._id);
  }
}
