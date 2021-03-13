import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { TgChat, TgChatSchema } from './schemas/TgChat.schema';
import { TgbotController } from './tgbot.controller';
import { TgbotService } from './tgbot.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TgChat.name, schema: TgChatSchema }]),
  ],
  providers: [TgbotService, FHSocket],
  controllers: [TgbotController],
  exports: [TgbotService],
})
export class TgbotModule {}
