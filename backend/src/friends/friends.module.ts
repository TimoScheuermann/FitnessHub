import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { User, UserSchema } from 'src/user/schemas/User.schema';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friendship, FriendshipSchema } from './schemas/Friendship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [FriendsService, FHSocket],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
