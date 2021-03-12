import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from 'src/message/message.module';
import { Message, MessageSchema } from 'src/message/schemas/Message.schema';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { User, UserSchema } from './schemas/User.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    TgbotModule,
    MessageModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
