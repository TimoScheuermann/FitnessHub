import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';

@Module({
  providers: [TgbotService],
  exports: [TgbotService],
})
export class TgbotModule {}
