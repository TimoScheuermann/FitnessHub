import { IExerciseInfo } from 'src/exercise/interfaces/IExerciseInfo';

export interface IWorkout {
  readonly _id?: string;
  readonly author: string;
  readonly title: string;
  readonly updated: number;
  readonly exercises: IExerciseInfo[];
}
