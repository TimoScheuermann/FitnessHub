import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFriendship } from './interfaces/IFriendship';
import { Friendship } from './schemas/Friendship.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
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

  public async getFriendsOf(id: string): Promise<string[]> {
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
    return friends
      .map(x => x.toObject())
      .map((x: IFriendship) => (x.invitee === id ? x.target : x.invitee));
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

  public async acceptFriendship(friendshipId: string): Promise<boolean> {
    await this.friendshipModel.findOneAndUpdate(
      { _id: friendshipId },
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

  public async getInvitations(user: string): Promise<Friendship[]> {
    return this.friendshipModel.find({
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

  public async denyFriendship(friendshipId: string): Promise<boolean> {
    await this.friendshipModel.findOneAndDelete({ _id: friendshipId });
    return true;
  }
}
