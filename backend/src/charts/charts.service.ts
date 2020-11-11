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

  public async getCharts(user: string): Promise<number[][]> {
    const until = new Date().getTime() - 4 * this.aWeek;

    // load latest data (4 weeks)
    const exercises = await this.completedExerciseModel.find(
      { start: { $gte: until }, user: user },
      { start: 1, end: 1 },
    );
    const data = Array.from({ length: 28 }, () => []);

    exercises.forEach((x) => {
      const index = this.getIndex(x.start);
      data[index].push(x.duration / 1000);
    });
    return data;
  }

  /**
   * returns how many days have passed since today
   * @param of timestamp
   */
  private getIndex(of: number): number {
    const start = new Date().getTime() - 4 * this.aWeek;
    const date = new Date(of).setHours(0, 0, 0, 0);
    return Math.floor((date - start) / this.aDay);
  }
}
