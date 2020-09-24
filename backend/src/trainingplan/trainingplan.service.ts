import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { Workout } from 'src/workout/schemas/Workout.schema';
import { ITrainingplan } from './interfaces/ITrainingplan';
import { ITrainingplanFull } from './interfaces/ITrainingplanFull';
import { Trainingplan } from './schemas/Trainingplan.schema';

@Injectable()
export class TrainingplanService {
  constructor(
    @InjectModel(Trainingplan.name)
    private trainingplanModel: Model<Trainingplan>,
    @InjectModel(Exercise.name)
    private exerciseModel: Model<Exercise>,
    @InjectModel(Workout.name)
    private workoutModel: Model<Workout>,
  ) {}

  public async getTrainingplan(userId: string): Promise<ITrainingplan> {
    return this.trainingplanModel.findOne({ author: userId });
  }

  public async getFullTrainingplan(userId: string): Promise<ITrainingplanFull> {
    const trainingPlan = (await this.getTrainingplan(userId)) as ITrainingplan;
    if (!trainingPlan) return undefined;

    const fullPlan: ITrainingplanFull = {
      _id: trainingPlan._id,
      author: trainingPlan.author,
    };

    const days = Array.from({ length: 7 }, (_x, i) => i + '').filter(
      (x) => !!trainingPlan[x],
    );

    let uniqueWorkoutIds = [];
    let uniqueExerciseIds = [];
    days.forEach((x) => {
      const data: string = trainingPlan[x];
      if (data.startsWith('ex_')) {
        uniqueExerciseIds.push(data.split('ex_')[1]);
      } else {
        uniqueWorkoutIds.push(data);
      }
    });

    uniqueWorkoutIds = [...new Set(uniqueWorkoutIds)];
    const uniqueWorkouts = await this.workoutModel.find({
      _id: { $in: uniqueWorkoutIds.map((x) => new mongo.ObjectID(x)) },
    });
    uniqueWorkouts.forEach((x) => uniqueExerciseIds.push(...x.exercises));
    uniqueExerciseIds = [...new Set(uniqueExerciseIds)];
    const uniqueExercises = await this.exerciseModel.find({
      _id: { $in: uniqueExerciseIds.map((x) => new mongo.ObjectID(x)) },
    });

    const getWorkout = (id: string) => {
      return uniqueWorkouts.filter((x) => x._id == id)[0];
    };
    const getExercise = (id: string) => {
      return uniqueExercises.filter((x) => x._id == id)[0];
    };

    days.forEach((x) => {
      const id = trainingPlan[x];
      let exercises = [];
      if (id.startsWith('ex_')) {
        exercises = [getExercise(id.split('ex_')[1])];
      } else {
        exercises = getWorkout(id).exercises.map(getExercise);
      }
      fullPlan[x] = {
        id: id,
        exercises: exercises,
      };
    });

    return fullPlan;
  }

  public async setIdForDay(
    userId: string,
    day: number,
    data: string,
  ): Promise<ITrainingplanFull> {
    const object = {};
    object[day] = data;
    await this.trainingplanModel.updateOne(
      { author: userId },
      { $set: object },
      { upsert: true },
    );
    return await this.getFullTrainingplan(userId);
  }

  public async removeDay(
    userId: string,
    day: number,
  ): Promise<ITrainingplanFull> {
    const object = {};
    object[day] = 1;
    await this.trainingplanModel.updateOne(
      { author: userId },
      { $unset: object },
    );
    return await this.getFullTrainingplan(userId);
  }
}
