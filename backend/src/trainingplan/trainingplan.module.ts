import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from 'src/exercise/schemas/Exercise.schema';
import { Workout, WorkoutSchema } from 'src/workout/schemas/Workout.schema';
import {
  Trainingplan,
  TrainingplanSchema,
} from './schemas/Trainingplan.schema';
import { TrainingplanController } from './trainingplan.controller';
import { TrainingplanService } from './trainingplan.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trainingplan.name, schema: TrainingplanSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Workout.name, schema: WorkoutSchema },
    ]),
  ],
  providers: [TrainingplanService],
  controllers: [TrainingplanController],
})
export class TrainingplanModule {}
