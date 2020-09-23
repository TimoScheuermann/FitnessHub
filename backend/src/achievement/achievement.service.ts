import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IExercise } from 'src/exercise/interfaces/IExercise';
import { CompletedExercise } from 'src/exercise/schemas/CompletedExercise.schema';
import { Exercise } from 'src/exercise/schemas/Exercise.schema';
import { IAchievment } from './interfaces/IAchievement';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    @InjectModel(CompletedExercise.name)
    private completedExerciseModel: Model<CompletedExercise>,
  ) {}

  public async getAchievements(userId: string): Promise<IAchievment[]> {
    const achievements: IAchievment[] = [];
    const exerciseIds = await this.getUniqueCompletedExercises(userId);
    await Promise.all(
      exerciseIds.map(async (x) => {
        const exercise = await this.getExercise(x);
        if (exercise) {
          achievements.push({
            asset: exercise.thumbnail,
            date: 0,
            subtitle: `Du hast zum ersten mal die Übung "${exercise.title}" gemacht`,
            title: exercise.title,
          });
        }
      }),
    );
    return achievements;
  }

  private async getUniqueCompletedExercises(userId: string): Promise<string[]> {
    return await this.completedExerciseModel.distinct('exercise', {
      user: userId,
    });
  }

  private async getExercise(exerciseId: string): Promise<IExercise> {
    return await this.exerciseModel.findOne({ _id: exerciseId });
  }
}
