import { IExercise } from './IExercise';

export interface IWorkout {
  readonly _id?: string;
  readonly author: string;
  readonly title: string;
  readonly exercises: IExercise[];
}
