import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { IUser } from 'src/user/interfaces/IUser';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { User } from 'src/user/schemas/User.schema';
import { IFriendship } from './interfaces/IFriendship';
import { IPendingFriendship } from './interfaces/IPendingFriendship';
import { Friendship } from './schemas/Friendship.schema';

@Injectable()
export class FriendsService {
  constructor(
    private readonly fhSocket: FHSocket,
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * check if a friendship between two users exists
   * @param userA string
   * @param userB string
   */
  public async doesFriendshipExist(
    userA: string,
    userB: string,
  ): Promise<boolean> {
    if (userA === userB) return true;
    return !!(await this.friendshipModel.findOne({
      $or: [
        { invitee: userA, target: userB, accepted: true },
        { invitee: userB, target: userA, accepted: true },
      ],
    }));
  }

  /**
   * returns a list of XY's friend's user infos
   * @param id user
   */
  public async getFriendsOf(id: string): Promise<IUserInfo[]> {
    const friends = await this.friendshipModel.find({
      $or: [
        { invitee: id, accepted: true },
        { target: id, accepted: true },
      ],
    });

    const idPairs = friends.map((x) => [x.invitee, x.target]);
    const uniqueIds = [...new Set([].concat(...idPairs))];
    const userIds = uniqueIds.filter((x) => isValidObjectId(x));

    const userInfos = (await this.userModel.find({ _id: { $in: userIds } }))
      .map((x) => this.getUserInfo(x))
      .filter((x) => x._id !== id);

    return userInfos;
  }

  /**
   * remove a friendship
   * @param userId userA
   * @param friendId userB
   */
  public async deleteFriendship(
    userId: string,
    friendId: string,
  ): Promise<void> {
    const friendship = await this.friendshipModel.findOneAndDelete({
      $or: [
        { invitee: userId, target: friendId },
        { invitee: friendId, target: userId },
      ],
    });

    // remove friends from list
    this.fhSocket.server.to(userId).emit('removeFriend', friendId);
    this.fhSocket.server.to(friendId).emit('removeFriend', userId);
    this.fhSocket.server
      .to(friendId)
      .to(userId)
      .emit('removeFriendRequest', friendship._id);
  }

  /**
   * accepts a friendship with user
   * @param user string
   * @param friendshipId id
   */
  public async acceptFriendship(
    user: IUser,
    friendshipId: string,
  ): Promise<void> {
    const friendship = await this.friendshipModel.findOneAndUpdate(
      { _id: friendshipId, target: user._id },
      { $set: { accepted: true } },
    );

    this.fhSocket.server
      .to(friendship.invitee)
      .to(friendship.target)
      .emit('removeFriendRequest', friendship._id);

    const invitee = this.getUserInfo(
      await this.userModel.findOne({ _id: friendship.invitee }),
    );
    const target = this.getUserInfo(user);

    this.fhSocket.server.to(invitee._id).emit('addFriend', target);
    this.fhSocket.server.to(target._id).emit('addFriend', invitee);
  }

  /**
   * checks if invitee has invited target
   * @param invitee userid
   * @param target userid
   */
  public async doesInvitationExist(
    invitee: string,
    target: string,
  ): Promise<boolean> {
    if (invitee === target) return true;
    return !!(await this.friendshipModel.findOne({
      $or: [
        { invitee: invitee, target: target },
        { invitee: target, target: invitee },
      ],
    }));
  }

  /**
   * returns pending friendships of a specfic user
   * @param user userid
   */
  public async getInvitations(user: string): Promise<IPendingFriendship[]> {
    const friendships = await this.friendshipModel.find({
      $or: [
        { target: user, accepted: false },
        { invitee: user, accepted: false },
      ],
    });

    const idPairs = friendships.map((x) => [x.invitee, x.target]);
    const uniqueIds = [...new Set([].concat(...idPairs))];
    const userIds = uniqueIds.filter((x) => isValidObjectId(x));

    const users = (
      await this.userModel.find({ _id: { $in: userIds } })
    ).map((x) => this.getUserInfo(x));

    const getUser = (id: string): IUserInfo => {
      return users.filter((x) => x._id == id)[0];
    };

    return friendships.map((x) => {
      return {
        _id: x._id,
        invitee: getUser(x.invitee),
        target: getUser(x.target),
      };
    });
  }

  /**
   * sends a friendship invivtation
   * @param invitee userid
   * @param target userid
   */
  public async sendInvitation(invitee: IUser, target: string): Promise<void> {
    if (await this.doesInvitationExist(invitee._id, target)) {
      return;
    }

    if (!isValidObjectId(invitee) || !isValidObjectId(target)) return;

    const targetUser = await this.userModel.findOne({ _id: target });

    if (!targetUser) return;

    const friendship = await this.friendshipModel.create({
      invitee: invitee._id,
      target: target,
      accepted: false,
    });

    const pending: IPendingFriendship = {
      _id: friendship._id,
      invitee: this.getUserInfo(invitee),
      target: this.getUserInfo(targetUser),
    };

    this.fhSocket.server
      .to(invitee._id)
      .to(target)
      .emit('newFriendRequest', pending);
  }

  /**
   * denies a friendship invite
   * @param targetId string
   * @param friendshipId string
   */
  public async denyFriendship(
    targetId: string,
    friendshipId: string,
  ): Promise<void> {
    const friendship = await this.friendshipModel.findOneAndDelete({
      _id: friendshipId,
      $or: [{ target: targetId }, { invitee: targetId }],
    });

    this.fhSocket.server
      .to(friendship.target)
      .to(friendship.invitee)
      .emit('removeFriendRequest', friendship._id);
  }

  /**
   * returns the total amount of friendships (admin stats)
   */
  public async getTotalFriendships(): Promise<number> {
    return this.friendshipModel.find({ accepted: true }).countDocuments();
  }

  /**
   * returns the total amount of open friendrequests for a specific user
   * @param id
   */
  public async getInvitationsCount(id: string): Promise<number> {
    return await this.friendshipModel
      .find({ target: id, accepted: false })
      .countDocuments();
  }

  /**
   * returns the friendship of two users if exists
   * @param userA string
   * @param userB string
   */
  public async getFriendship(
    userA: string,
    userB: string,
  ): Promise<IFriendship> {
    return ((
      await this.friendshipModel.findOne({
        $or: [
          { invitee: userA, target: userB },
          { invitee: userB, target: userA },
        ],
      })
    ).toObject() as unknown) as IFriendship;
  }

  /**
   * returns more information about a specific friend
   * @param id
   */
  public async getFriendInformations(id: string): Promise<any> {
    if (!isValidObjectId(id)) return {};

    const user: IUser = await this.userModel.findOne({ _id: id });
    if (!user) return {};

    return {
      memberSince: user.date,
    };
  }

  private transformName(user: IUser | User): string {
    return [user.givenName, user.familyName].filter((x) => !!x).join(' ');
  }

  private getUserInfo(user: IUser | User): IUserInfo {
    return {
      _id: user._id,
      avatar: user.avatar,
      username: this.transformName(user),
    };
  }
}
