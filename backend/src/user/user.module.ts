import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { User, UserSchema } from './schemas/User.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TgbotModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
