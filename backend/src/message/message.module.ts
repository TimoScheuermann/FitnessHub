import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { FriendsModule } from 'src/friends/friends.module';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message, MessageSchema } from './schemas/Message.schema';

@Module({
  imports: [
    FriendsModule,
    TgbotModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService, FHSocket],
  exports: [MessageService],
})
export class MessageModule {}
