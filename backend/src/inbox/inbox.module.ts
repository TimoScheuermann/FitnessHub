import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsModule } from 'src/friends/friends.module';
import { UserModule } from 'src/user/user.module';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';
import { Inbox, InboxSchema } from './schemas/Inbox.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inbox.name, schema: InboxSchema }]),
    UserModule,
    FriendsModule,
  ],
  providers: [InboxService],
  controllers: [InboxController],
})
export class InboxModule {}
