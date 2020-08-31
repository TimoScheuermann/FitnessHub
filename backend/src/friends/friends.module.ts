import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { UserModule } from 'src/user/user.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friendship, FriendshipSchema } from './schemas/Friendship.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
  ],
  providers: [FriendsService, FHSocket],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
