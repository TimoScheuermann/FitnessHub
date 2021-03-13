import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { Feed } from 'src/feed/schemas/Feed.schema';
import { FHSocket } from 'src/FHSocket';
import { Friendship } from 'src/friends/schemas/Friendship.schema';
import { Achievement } from './schemas/Achievement.schema';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<Achievement>,
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    @InjectModel(Feed.name) private feedModel: Model<Feed>,
    private readonly fhSocket: FHSocket,
  ) {}

  public async getAchievements(
    requester: string,
    target: string,
  ): Promise<Achievement[]> {
    if (!requester || !target) return [];
    if (!isValidObjectId(requester) || !isValidObjectId(target)) return [];

    if (!(await this.doesFriendshipExist(requester, target))) return [];
    return this.achievementModel.find({ userId: target });
  }

  public async addExAchievement(
    userId: string,
    exercise: Exercise,
  ): Promise<void> {
    let achievement = await this.achievementModel.findOne({
      userId: userId,
      exerciseId: exercise._id,
    });
    const date = new Date().getTime();

    if (!achievement) {
      achievement = await this.achievementModel.create({
        userId: userId,
        exerciseId: exercise._id,
        exerciseTitle: exercise.title,
        achievedAt: [],
      });
      achievement.achievedAt = [date];
      this.fhSocket.server.to(userId).emit('achievement', achievement.toJSON());

      await this.feedModel.create({
        timestamp: date,
        text:
          'Ich habe zum ersten Mal die Übung ' +
          exercise.title +
          ' ausgeführt.',
        achievementTitle: 'Erfolg erzielt!',
        user: userId,
      });
    }

    await achievement.update({ $addToSet: { achievedAt: date } });
  }

  private async doesFriendshipExist(
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
}
