import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from './interfaces/IUser';
import { IUserInfo } from './interfaces/IUserInfo';
import { User } from './schemas/User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tgbotService: TgbotService,
  ) {}

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
      .map(x => x.toObject())
      .map((x: IUser) => {
        return {
          _id: x._id,
          avatar: x.avatar,
          username: this.transformName(x),
        } as IUserInfo;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter(x => !!x).join(' ');
  }
}
