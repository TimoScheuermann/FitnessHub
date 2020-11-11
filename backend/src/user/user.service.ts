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

  /**
   * user id for fitnesshub bot
   */
  public FPUID = '5f4a1a372149ef521c108f4a';

  /**
   * checks if a user has already exists (2nd, 3rd, ... login)
   * @param provider login provider
   * @param thirdPartyId providers id
   */
  async userExists(provider: Provider, thirdPartyId: string): Promise<boolean> {
    const users = await this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });
    return !!users.id;
  }

  /**
   * update users information on login (maybe name or avatar change)
   * @param iuser
   */
  async signIn(iuser: IUser): Promise<User> {
    const user: User = await this.getUserByOAuth(
      iuser.provider,
      iuser.thirdPartyId,
    );

    // update if user has signed in before
    if (user) {
      await this.updateUser(user);
      return user;

      // create new user due to first login
    } else {
      const user = await this.userModel.create({
        ...iuser,
        date: new Date().getTime(),
        group: 'User',
      });

      this.tgbotService.sendMessage(
        `Ein neuer User hat sich angemeldet!
      <b>Name</b> ${this.transformName(user)}`,
      );

      // send welcome message
      await this.messageModel.create({
        date: new Date().getTime(),
        from: this.FPUID,
        content:
          'Willkommen beim FitnessHub! Danke, dass du der Community beigetreten bist.',
        to: user._id,
        read: false,
        type: 'message',
      });
      return user;
    }
  }

  /**
   * update a user if its not his first login
   * @param u updated user information
   */
  async updateUser(u: IUser): Promise<void> {
    const user = await new this.userModel(u).toObject();
    delete user._id;
    if (u._id === '5f47a68688e01f1eaa1881d9') delete user.avatar;
    await this.userModel.findByIdAndUpdate(u._id, user);
  }

  /**
   * returns fh stored user data
   * @param provider
   * @param thirdPartyId
   */
  async getUserByOAuth(
    provider: Provider,
    thirdPartyId: string,
  ): Promise<User> {
    return this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });
  }

  /**
   * returns a user with a specific id
   * @param id string
   */
  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({
      _id: id,
    });
  }

  /**
   * returns only the user info of a specific userId
   * @param id string
   */
  async getUserInfoById(id: string): Promise<IUserInfo> {
    const user = await this.getUserById(id);
    return {
      _id: user._id,
      username: this.transformName(user),
      avatar: user.avatar,
    };
  }

  /**
   * find users matching the query (limit 30)
   * @param query
   */
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

  /**
   * transforms a usersname to its fullname
   * @param user IUser
   */
  public transformName(user: IUser): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  /**
   * returns the total amount of users existing on fitnesshub
   */
  public async getTotalUsers(): Promise<number> {
    return this.userModel.countDocuments();
  }

  /**
   * returns the total amount of user signed in via a specific login provider
   * @param provider Provider
   */
  public async getAmountByOAuth(provider: Provider): Promise<any> {
    return this.userModel.find({ provider: provider }).countDocuments();
  }

  /**
   * promotes a user to a specific group
   * @param promoter IUser
   * @param id targeted user's id
   * @param group group to promote to
   */
  public async promoteTo(
    promoter: IUser,
    id: string,
    group: 'User' | 'Moderator',
  ): Promise<void> {
    const user = await this.getUserById(id);
    if (user && user.group !== 'Admin') {
      await user.update({ $set: { group: group } });

      this.tgbotService.sendMessage(
        `<b>${this.transformName(promoter)}</b> hat <b>${this.transformName(
          user,
        )} zur Gruppe <b>${group}</b> hinzugefügt.`,
      );
    }
  }

  /**
   * returns a list of all moderators
   */
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

  /**
   * returns a list of all suspended users
   */
  public async getSuspendedUser(): Promise<IUserInfo[]> {
    return (
      await this.userModel.find({
        suspended: { $exists: true },
      })
    )
      .map((x) => x.toObject())
      .map((x: IUser) => {
        return {
          _id: x._id,
          avatar: x.avatar,
          username: this.transformName(x),
          suspended: x.suspended,
        } as IUserInfo;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  /**
   * returns a list of every userid
   */
  public async getEveryId(): Promise<string[]> {
    return (await this.userModel.find())
      .map((x) => x._id)
      .filter((x) => x + '' !== this.FPUID);
  }

  /**
   * pardons a specific user
   * @param id string
   */
  public async pardonUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user) await user.updateOne({ $unset: { suspended: 0 } });
  }

  /**
   * suspends a specific user untill a specific date
   * @param suspender user
   * @param id suspended user's id
   * @param time date untill pardon
   */
  public async suspendUser(
    suspender: IUser,
    id: string,
    time: number,
  ): Promise<void> {
    const user = await this.getUserById(id);
    if (user) {
      await user.updateOne({ $set: { suspended: time } });
      this.tgbotService.sendURLMessage(
        `<b>${this.transformName(suspender)}</b> hat ${this.transformName(
          user,
        )} temporär gesperrt!`,
        'Gesperrte Nutzer anzeigen',
        'https://fitnesshub.app/profile/management/suspend-user',
      );
    }
  }

  /**
   * returns a list of ids of all user inside the groups admin or moderator
   */
  public async getAllIdsExceptUser(): Promise<string[]> {
    const users = await this.userModel.find({
      $or: [{ group: 'Moderator' }, { group: 'Admin' }],
    });
    return users.map((x) => x._id);
  }
}
