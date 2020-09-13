import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
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
    const trainingPlan = await this.getTrainingplan(userId);
    if (!trainingPlan) return undefined;

    const fullPlan: ITrainingplanFull = {
      _id: trainingPlan._id,
      author: trainingPlan.author,
    };
    for (let i = 0; i < 7; i++) {
      let data: string | undefined = trainingPlan[i];
      if (data) {
        const items: IExercise[] = [];
        if (data.startsWith('ex_')) {
          data = data.split('ex_')[1];
          items.push(await this.exerciseModel.findOne({ _id: data }));
        } else {
          const workout = await this.workoutModel.findOne({ _id: data });
          workout.exercises.forEach(async (x) => {
            items.push(await this.exerciseModel.findOne({ _id: x }));
          });
        }
        fullPlan[i] = { id: trainingPlan[i], exercises: items };
      }
    }
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
