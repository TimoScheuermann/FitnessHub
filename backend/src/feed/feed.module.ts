import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import {
  Friendship,
  FriendshipSchema,
} from 'src/friends/schemas/Friendship.schema';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { User, UserSchema } from 'src/user/schemas/User.schema';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Feed, FeedSchema } from './schemas/Feed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feed.name, schema: FeedSchema },
      { name: User.name, schema: UserSchema },
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
    TgbotModule,
  ],
  exports: [FeedService],
  controllers: [FeedController],
  providers: [FeedService, FHSocket],
})
export class FeedModule {}
