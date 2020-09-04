import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { IUser } from 'src/user/interfaces/IUser';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { UserService } from 'src/user/user.service';
import { IFriendship } from './interfaces/IFriendship';
import { IPendingFriendship } from './interfaces/IPendingFriendship';
import { Friendship } from './schemas/Friendship.schema';

@Injectable()
export class FriendsService {
  constructor(
    private userService: UserService,
    private readonly fhSocket: FHSocket,
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
  ) {}

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

  public async getFriendsOf(id: string): Promise<IUserInfo[]> {
    const friends = await this.friendshipModel.find({
      $or: [
        { invitee: id, accepted: true },
        { target: id, accepted: true },
      ],
    });
    return Promise.all(
      friends
        .map((x) => x.toObject())
        .map(
          async (x: IFriendship) =>
            await this.userService.getUserInfoById(
              x.invitee === id ? x.target : x.invitee,
            ),
        ),
    );
  }

  public async deleteFriendship(
    userId: string,
    friendId: string,
  ): Promise<void> {
    const friendship: IFriendship = await this.friendshipModel.findOneAndDelete(
      {
        $or: [
          { invitee: userId, target: friendId },
          { invitee: friendId, target: userId },
        ],
      },
    );
    this.fhSocket.server.to(userId).emit('removeFriend', friendId);
    this.fhSocket.server.to(friendId).emit('removeFriend', userId);
    this.fhSocket.server
      .to(friendId)
      .to(userId)
      .emit('removeFriendRequest', friendship._id);
  }

  public async acceptFriendship(
    user: IUser,
    friendshipId: string,
  ): Promise<void> {
    const friendship: IFriendship = await this.friendshipModel.findOneAndUpdate(
      { _id: friendshipId, target: user._id },
      { $set: { accepted: true } },
    );

    this.fhSocket.server
      .to(friendship.invitee)
      .to(friendship.target)
      .emit('removeFriendRequest', friendship._id);

    const invitee: IUserInfo = await this.userService.getUserInfoById(
      friendship.invitee,
    );
    const target: IUserInfo = {
      _id: user._id,
      username: this.userService.transformName(user),
      avatar: user.avatar,
    };

    this.fhSocket.server.to(invitee._id).emit('addFriend', target);
    this.fhSocket.server.to(target._id).emit('addFriend', invitee);
  }

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

  public async getInvitations(user: string): Promise<IPendingFriendship[]> {
    const friendships = await this.friendshipModel.find({
      $or: [
        { target: user, accepted: false },
        { invitee: user, accepted: false },
      ],
    });
    return Promise.all(
      friendships.map(async (x: IFriendship) => {
        return {
          _id: x._id,
          invitee: await this.userService.getUserInfoById(x.invitee),
          target: await this.userService.getUserInfoById(x.target),
        } as IPendingFriendship;
      }),
    );
  }

  public async sendInvitation(invitee: IUser, target: string): Promise<void> {
    if (await this.doesInvitationExist(invitee._id, target)) {
      return;
    }
    const friendship: IFriendship = await this.friendshipModel.create({
      invitee: invitee._id,
      target: target,
      accepted: false,
    });

    const pending: IPendingFriendship = {
      _id: friendship._id,
      invitee: {
        _id: invitee._id,
        avatar: invitee.avatar,
        username: this.userService.transformName(invitee),
      },
      target: await this.userService.getUserInfoById(target),
    };

    this.fhSocket.server
      .to(invitee._id)
      .to(target)
      .emit('newFriendRequest', pending);
  }

  public async denyFriendship(
    targetId: string,
    friendshipId: string,
  ): Promise<void> {
    const friendship: IFriendship = await this.friendshipModel.findOneAndDelete(
      { _id: friendshipId, target: targetId },
    );
    this.fhSocket.server
      .to(friendship.target)
      .to(friendship.invitee)
      .emit('removeFriendRequest', friendship._id);
  }

  public async getTotalFriendships(): Promise<number> {
    return this.friendshipModel.find({ accepted: true }).countDocuments();
  }

  public async getInvitationsCount(id: string): Promise<number> {
    return await this.friendshipModel
      .find({ target: id, accepted: false })
      .countDocuments();
  }

  public async getFriendship(
    userA: string,
    userB: string,
  ): Promise<IFriendship> {
    return await this.friendshipModel.findOne({
      $or: [
        { invitee: userA, target: userB },
        { invitee: userB, target: userA },
      ],
    });
  }

  public async getFriendInformations(id: string): Promise<any> {
    const user: IUser = await this.userService.getUserById(id);
    return {
      memberSince: user.date,
    };
  }
}
