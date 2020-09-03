import { IExercise } from './IExercise';

export interface IWorkout {
  readonly _id?: string;
  readonly exercises: IExercise[];
  readonly title: string;
  readonly author: string;
}
