import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feed, FeedSchema } from 'src/feed/schemas/Feed.schema';
import { FHSocket } from 'src/FHSocket';
import {
  Friendship,
  FriendshipSchema,
} from 'src/friends/schemas/Friendship.schema';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { Achievement, AchievementSchema } from './schemas/Achievement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
      { name: Friendship.name, schema: FriendshipSchema },
      { name: Feed.name, schema: FeedSchema },
    ]),
  ],
  providers: [AchievementService, FHSocket],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
