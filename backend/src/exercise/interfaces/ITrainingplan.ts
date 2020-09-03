import { IExercise } from './IExercise';
import { IWorkout } from './IWorkout';

export interface ITrainingplan {
  readonly _id?: string;
  readonly monday?: IWorkout | IExercise[];
  readonly tuesday?: IWorkout | IExercise[];
  readonly wednesday?: IWorkout | IExercise[];
  readonly thursday?: IWorkout | IExercise[];
  readonly friday?: IWorkout | IExercise[];
  readonly saturday?: IWorkout | IExercise[];
  readonly sunday?: IWorkout | IExercise[];
}
