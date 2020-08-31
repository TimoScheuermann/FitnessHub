import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { FriendsService } from 'src/friends/friends.service';
import { IFriendship } from 'src/friends/interfaces/IFriendship';
import { IMessage } from './interfaces/IMessage';
import { Message } from './schemas/Message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly friendsService: FriendsService,
    private readonly fhSocket: FHSocket,
  ) {}

  private async getSecret(userA: string, userB: string): Promise<string> {
    const friendship: IFriendship = await this.friendsService.getFriendship(
      userA,
      userB,
    );
    return friendship.since + '';
  }

  public async getMessages(userID: string): Promise<IMessage[]> {
    return this.messageModel.find({
      $or: [{ from: userID }, { to: userID }],
    });
  }

  public async sendMessage(
    from: string,
    to: string,
    message: string,
  ): Promise<void> {
    const secret = await this.getSecret(from, to);
    const createdMessage: Message = await this.messageModel.create({
      date: new Date().getTime(),
      content: message,
      from: from,
      to: to,
      type: 'message',
      read: false,
    });

    this.fhSocket.server
      .to(from)
      .to(to)
      .emit('message', createdMessage);
    // TODO: encrypt data, send message via socket io to sender and receiver
  }

  public async ping() {
    this.fhSocket.server.emit('message', 'global');
    this.fhSocket.server
      .to('5f4668c0e00c280e3a68c95c')
      .emit('message', 'private');
  }
}
