import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompletedExercise,
  CompletedExerciseSchema,
} from 'src/exercise/schemas/CompletedExercise.schema';
import { Exercise, ExerciseSchema } from 'src/exercise/schemas/Exercise.schema';
import { Feed, FeedSchema } from 'src/feed/schemas/Feed.schema';
import {
  Friendship,
  FriendshipSchema,
} from 'src/friends/schemas/Friendship.schema';
import { Message, MessageSchema } from 'src/message/schemas/Message.schema';
import { Recipe, RecipeSchema } from 'src/recipe/schemas/Recipe.schema';
import { UserModule } from 'src/user/user.module';
import { Workout, WorkoutSchema } from 'src/workout/schemas/Workout.schema';
import { Variable, VariableSchema } from '../variables/schemas/Variable.schema';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: Friendship.name, schema: FriendshipSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Recipe.name, schema: RecipeSchema },
      { name: CompletedExercise.name, schema: CompletedExerciseSchema },
      { name: Variable.name, schema: VariableSchema },
      { name: Feed.name, schema: FeedSchema },
    ]),
    UserModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
