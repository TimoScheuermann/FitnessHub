import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FHSocket } from 'src/FHSocket';
import { Message, MessageSchema } from 'src/message/schemas/Message.schema';
import { TgbotModule } from 'src/tgbot/tgbot.module';
import { UserModule } from 'src/user/user.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise, ExerciseSchema } from './schemas/Exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UserModule,
    TgbotModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService, FHSocket],
})
export class ExerciseModule {}
