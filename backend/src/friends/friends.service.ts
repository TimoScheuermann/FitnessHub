import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserInfo } from 'src/user/interfaces/IUserInfo';
import { UserService } from 'src/user/user.service';
import { IFriendship } from './interfaces/IFriendship';
import { IPendingFriendship } from './interfaces/IPendingFriendship';
import { Friendship } from './schemas/Friendship.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    private userService: UserService,
  ) {}

  public async doesFriendshipExist(
    userA: string,
    userB: string,
  ): Promise<boolean> {
    if (userA === userB) return true;
    return !!(await this.friendshipModel.findOne({
      $or: [
        {
          invitee: userA,
          target: userB,
          accepted: true,
        },
        {
          invitee: userB,
          target: userA,
          accepted: true,
        },
      ],
    }));
  }

  public async getFriendsOf(id: string): Promise<IUserInfo[]> {
    const friends = await this.friendshipModel.find({
      $or: [
        {
          invitee: id,
          accepted: true,
        },
        {
          target: id,
          accepted: true,
        },
      ],
    });
    return Promise.all(
      friends
        .map(x => x.toObject())
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
  ): Promise<boolean> {
    await this.friendshipModel.findOneAndDelete({
      $or: [
        {
          invitee: userId,
          target: friendId,
        },
        {
          invitee: friendId,
          target: userId,
        },
      ],
    });
    return true;
  }

  public async acceptFriendship(
    targetId: string,
    friendshipId: string,
  ): Promise<boolean> {
    await this.friendshipModel.findOneAndUpdate(
      { _id: friendshipId, target: targetId },
      { $set: { accepted: true } },
    );
    return true;
  }

  public async doesInvitationExist(
    invitee: string,
    target: string,
  ): Promise<boolean> {
    if (invitee === target) return true;
    return !!(await this.friendshipModel.findOne({
      $or: [
        {
          invitee: invitee,
          target: target,
        },
        {
          invitee: target,
          target: invitee,
        },
      ],
    }));
  }

  public async getInvitations(user: string): Promise<IPendingFriendship[]> {
    const friendships = await this.friendshipModel.find({
      $or: [
        {
          target: user,
          accepted: false,
        },
        {
          invitee: user,
          accepted: false,
        },
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

  public async sendInvitation(
    invitee: string,
    target: string,
  ): Promise<boolean> {
    if (await this.doesInvitationExist(invitee, target)) {
      return false;
    }
    await this.friendshipModel.create({
      invitee: invitee,
      target: target,
      accepted: false,
    });
    return true;
  }

  public async denyFriendship(
    targetId: string,
    friendshipId: string,
  ): Promise<boolean> {
    await this.friendshipModel.findOneAndDelete({
      _id: friendshipId,
      target: targetId,
    });
    return true;
  }

  public async getTotalFriendships(): Promise<number> {
    return this.friendshipModel.find({ accepted: true }).countDocuments();
  }

  public async getInvitationsCount(id: string): Promise<number> {
    return await this.friendshipModel
      .find({ target: id, accepted: false })
      .countDocuments();
  }
}
