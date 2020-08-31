import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Get('test')
  test() {
    this.messageService.ping();
  }

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
    @Body() body,
  ): Promise<void> {
    this.messageService.sendMessage(from._id, to, body.message);
  }
}
