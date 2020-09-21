import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from 'src/exercise/schemas/CompletedExercise.schema';
import { Exercise, ExerciseSchema } from 'src/exercise/schemas/Exercise.schema';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
    ]),
  ],
  providers: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
