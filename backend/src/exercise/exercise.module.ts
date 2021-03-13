import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementModule } from 'src/achievement/achievement.module';
import { FeedModule } from 'src/feed/feed.module';
import { FHSocket } from 'src/FHSocket';
import { FriendsModule } from 'src/friends/friends.module';
import {
  Variable,
  VariableSchema,
} from 'src/management/variables/schemas/Variable.schema';
import { MessageModule } from 'src/message/message.module';
import { Message, MessageSchema } from 'src/message/schemas/Message.schema';
import { SettingModule } from 'src/setting/setting.module';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { User, UserSchema } from 'src/user/schemas/User.schema';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from './schemas/CompletedExercise.schema';
import { Exercise, ExerciseSchema } from './schemas/Exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Message.name, schema: MessageSchema },
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
      { name: Variable.name, schema: VariableSchema },
    ]),
    FriendsModule,
    SettingModule,
    FeedModule,
    MessageModule,
    AchievementModule,
    TgbotModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService, FHSocket],
})
export class ExerciseModule {}
