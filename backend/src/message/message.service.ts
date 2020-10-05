import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { FriendsService } from 'src/friends/friends.service';
import { IFriendship } from 'src/friends/interfaces/IFriendship';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { IMessage } from './interfaces/IMessage';
import { Message } from './schemas/Message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly friendsService: FriendsService,
    private readonly fhSocket: FHSocket,
    private readonly tgbotService: TgbotService,
  ) {}

  private async getSecret(userA: string, userB: string): Promise<string> {
    const friendship: IFriendship = await this.friendsService.getFriendship(
      userA,
      userB,
    );
    return friendship._id;
  }

  public async getMessages(userID: string): Promise<IMessage[]> {
    return this.messageModel.find({
      $or: [{ from: userID }, { to: userID }],
    });
  }
  public async markAsRead(userId: string, friendId: string): Promise<void> {
    await this.messageModel.updateMany(
      { from: friendId, to: userId },
      { $set: { read: true } },
    );
  }

  public async sendMessage(
    from: IUser,
    to: string,
    message: string,
  ): Promise<void> {
    // const secret = await this.getSecret(from, to);
    const createdMessage: Message = await this.messageModel.create({
      date: new Date().getTime(),
      content: message,
      from: from._id,
      to: to,
      type: 'message',
      read: false,
    });

    this.fhSocket.server.to(from._id).to(to).emit('message', createdMessage);

    if (!this.fhSocket.server.sockets.adapter.rooms[to]) {
      const name = [from.givenName, from.familyName]
        .filter((x) => !!x)
        .join(' ');
      console.log('Sende telegram');
      this.tgbotService.sendMessageToUser(
        to,
        '<b>' + name + 'schreibt:</b>\n' + message,
      );
    }
    // TODO: encrypt data
  }
}
