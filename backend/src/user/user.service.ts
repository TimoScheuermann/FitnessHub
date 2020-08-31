import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { Message } from 'src/message/schemas/Message.schema';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from './interfaces/IUser';
import { IUserInfo } from './interfaces/IUserInfo';
import { User } from './schemas/User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly tgbotService: TgbotService,
  ) {}

  public FPUID = '5f4a1a372149ef521c108f4a';

  async userExists(provider: Provider, thirdPartyId: string): Promise<boolean> {
    const users = await this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });

    return !!users.id;
  }

  async signIn(iuser: IUser): Promise<User> {
    const user: User = await this.getUserByOAuth(
      iuser.provider,
      iuser.thirdPartyId,
    );

    if (user) {
      await this.updateUser(user);
      return user;
    } else {
      const user = await this.userModel.create({
        ...iuser,
        date: new Date().getTime(),
        group: 'User',
      });
      this.tgbotService.sendMessage(
        `Ein neuer User hat sich angemeldet!\nName: ${user.givenName} ${user.familyName}`,
      );
      await this.messageModel.create({
        date: new Date().getTime(),
        from: this.FPUID,
        content:
          'Willkommen beim Fitness Planner! Danke, dass du der Community beigetreten bist.',
        to: user._id,
        read: false,
        type: 'message',
      });
      return user;
    }
  }

  async updateUser(u: IUser) {
    const user = new this.userModel(u).toObject();
    delete user._id;
    this.userModel.findByIdAndUpdate(u._id, user);
  }

  async getUserByOAuth(
    provider: Provider,
    thirdPartyId: string,
  ): Promise<User> {
    return this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({
      _id: id,
    });
  }

  async getUserInfoById(id: string): Promise<IUserInfo> {
    const user = await this.getUserById(id);
    return {
      _id: user._id,
      username: this.transformName(user),
      avatar: user.avatar,
    };
  }

  public async find(query: string): Promise<IUserInfo[]> {
    const reg = new RegExp(`${query}`, 'i');
    return (
      await this.userModel
        .find({
          $or: [{ familyName: reg }, { givenName: reg }],
        })
        .limit(30)
    )
      .map((x) => x.toObject())
      .map((x: IUser) => {
        return {
          _id: x._id,
          avatar: x.avatar,
          username: this.transformName(x),
        } as IUserInfo;
      })
      .filter((x) => x._id + '' !== this.FPUID)
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  public async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  public async getAmountByOAuth(provider: Provider): Promise<any> {
    return this.userModel.find({ provider: provider }).countDocuments();
  }

  public async promoteTo(
    promoter: IUser,
    id: string,
    group: 'User' | 'Moderator',
  ): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      if (user.group !== 'Admin') {
        user.update({ $set: { group: group } });
        this.tgbotService.sendMessage(
          `${this.transformName(promoter)} promoted ${this.transformName(
            user,
          )} to ${group}`,
        );
      }
    }
  }

  public async getModerators(): Promise<IUserInfo[]> {
    return (
      await this.userModel.find({
        group: 'Moderator',
      })
    )
      .map((x) => x.toObject())
      .map((x: IUser) => {
        return {
          _id: x._id,
          avatar: x.avatar,
          username: this.transformName(x),
        } as IUserInfo;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  public async getEveryId(): Promise<string[]> {
    return (await this.userModel.find())
      .map((x) => x._id)
      .filter((x) => x + '' !== this.FPUID);
  }
}
