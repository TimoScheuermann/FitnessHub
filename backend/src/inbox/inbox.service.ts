import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendsService } from 'src/friends/friends.service';
import { UserService } from 'src/user/user.service';
import { IInbox } from './interfaces/IInbox';
import { ITotalMessages } from './interfaces/ITotalMessages';
import { Inbox } from './schemas/Inbox.schema';

@Injectable()
export class InboxService {
  constructor(
    @InjectModel(Inbox.name) private inboxModel: Model<Inbox>,
    private readonly friendsService: FriendsService,
    private readonly userService: UserService,
  ) {}

  public async remove(toId: string, inboxId: string): Promise<void> {
    await this.inboxModel.findOneAndDelete({ to: toId, _id: inboxId });
  }

  public async getInbox(toId: string): Promise<IInbox[]> {
    const inbox = await this.inboxModel.find({ to: toId });
    return Promise.all(
      inbox.map(async x => {
        return {
          _id: x._id,
          date: x.date,
          from: await this.userService.getUserInfoById(x.from),
          message: x.message,
        } as IInbox;
      }),
    );
  }

  public async sendToInbox(from: string, to: string, message: string) {
    await this.inboxModel.create({
      date: new Date().getTime(),
      from: from,
      message: message,
      to: to,
    });
  }

  public async sendToEveryUser(from: string, message: string) {
    (await this.userService.getEveryId()).forEach(x =>
      this.sendToInbox(from, x, message),
    );
  }

  public async getTotalMessages(id: string): Promise<ITotalMessages> {
    return {
      inbox: await this.inboxModel.find({ to: id }).countDocuments(),
      friends: await this.friendsService.getInvitationsCount(id),
    };
  }
}
