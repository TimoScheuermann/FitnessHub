import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { User, UserSchema } from 'src/user/schemas/User.schema';
import { TgbotController } from './tgbot.controller';
import { TgbotService } from './tgbot.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TgbotService, FHSocket],
  exports: [TgbotService],
  controllers: [TgbotController],
})
export class TgbotModule {}
