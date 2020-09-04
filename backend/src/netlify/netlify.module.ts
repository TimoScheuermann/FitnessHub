import { Module } from '@nestjs/common';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { NetlifyController } from './netlify.controller';

@Module({
  controllers: [NetlifyController],
  imports: [TgbotModule],
})
export class NetlifyModule {}
