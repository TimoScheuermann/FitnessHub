import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { MessageService } from 'src/message/message.service';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { FHBot } from './FHBot.user';
import { IUser } from './interfaces/IUser';
import { IUserInfo } from './interfaces/IUserInfo';
import { User } from './schemas/User.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly messageService: MessageService,
    private readonly tgbotService: TgbotService,
  ) {}

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
        provider: iuser.provider,
        date: new Date().getTime(),
        group: 'User',
      });

      this.tgbotService.sendMessage(
        `Ein neuer User hat sich angemeldet!
      <b>Name</b> ${((user.toJSON() as unknown) as IUserInfo).username}`,
      );

      this.messageService.sendMessage(
        FHBot,
        user._id,
        'Willkommen in der FitnessHub! Danke, dass du der Community beigetreten bist',
      );

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
    // Jeannine B.
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
    return this.userModel.findOne({ _id: id });
  }

  /**
   * returns only the user info of a specific userId
   * @param id string
   */
  async getUserInfoById(id: string): Promise<IUserInfo> {
    return ((await this.getUserById(id)).toJSON() as unknown) as IUserInfo;
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
          _id: { $ne: FHBot._id },
        })
        .limit(30)
    )
      .map((x) => (x.toJSON() as unknown) as IUserInfo)
      .sort((a, b) => a.username.localeCompare(b.username));
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
   * @param id targeted user's id
   * @param group group to promote to
   */
  public async promoteTo(
    id: string,
    group: 'User' | 'Moderator',
  ): Promise<void> {
    const user = await this.getUserById(id);
    if (user && user.group !== 'Admin') {
      await user.update({ $set: { group: group } });
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
      .map((x) => (x.toJSON() as unknown) as IUserInfo)
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
      .map((x: User) => {
        return {
          _id: x._id,
          avatar: x.avatar,
          username: ((x.toJSON() as unknown) as IUserInfo).username,
          suspended: x.suspended,
          suspendedBy: x.suspendedBy,
        } as IUserInfo;
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  /**
   * returns a list of every userid
   */
  public async getEveryId(): Promise<string[]> {
    return (await this.userModel.find({ _id: { $ne: FHBot._id } })).map(
      (x) => x._id,
    );
  }

  /**
   * pardons a specific user
   * @param id string
   */
  public async pardonUser(id: string): Promise<void> {
    const user = await this.getUserById(id);
    if (user) await user.updateOne({ $unset: { suspended: '' } });
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
      await user.updateOne({
        $set: { suspended: time, suspendedBy: suspender._id },
      });
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
