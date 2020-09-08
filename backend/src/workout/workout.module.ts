import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from 'src/exercise/schemas/Exercise.schema';
import { FHSocket } from 'src/FHSocket';
import { Workout, WorkoutSchema } from './schemas/Workout.schema';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  providers: [WorkoutService, FHSocket],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
