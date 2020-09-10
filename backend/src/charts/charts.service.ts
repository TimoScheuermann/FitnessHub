import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompletedExercise } from 'src/exercise/schemas/CompletedExercise.schema';

@Injectable()
export class ChartsService {
  constructor(
    @InjectModel(CompletedExercise.name)
    private completedExerciseModel: Model<CompletedExercise>,
  ) {}

  public aWeek = 1000 * 60 * 60 * 24 * 7;
  public aDay = 1000 * 60 * 60 * 24;

  public async getCharts(user: string): Promise<any> {
    return {
      times: await this.getTrainingTime(user),
      workouts: await this.getWorkouts(user),
    };
  }

  private getIndex(of: number): number {
    const start = new Date().getTime() - 4 * this.aWeek;
    const date = new Date(of).setHours(0, 0, 0, 0);
    return Math.floor((date - start) / this.aDay);
  }

  private async getTrainingTime(user: string): Promise<any> {
    const until = new Date().getTime() - 4 * this.aWeek;
    const finished = await this.completedExerciseModel.find(
      { start: { $gte: until }, user: user },
      { start: 1, end: 1 },
    );
    const times = Array.from({ length: 28 }, () => 0);
    finished.forEach((x) => {
      const index = this.getIndex(x.start);
      const time = Math.round((x.end - x.start) / 1000);
      times[index] += time;
    });
    return times;
  }

  private async getWorkouts(user: string): Promise<any[]> {
    const until = new Date().getTime() - 4 * this.aWeek;
    const finished = await this.completedExerciseModel.find(
      { start: { $gte: until }, user: user },
      { start: 1 },
    );
    const amount = Array.from({ length: 28 }, () => 0);

    finished.forEach((x) => {
      const index = this.getIndex(x.start);
      amount[index]++;
    });
    return amount;
  }
}
