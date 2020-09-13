import { IExercise } from 'src/exercise/interfaces/IExercise';

export interface ITrainingplanFull {
  readonly _id: string;
  readonly author: string;
  readonly 0?: { id: string; exercises: IExercise[] };
  readonly 1?: { id: string; exercises: IExercise[] };
  readonly 2?: { id: string; exercises: IExercise[] };
  readonly 3?: { id: string; exercises: IExercise[] };
  readonly 4?: { id: string; exercises: IExercise[] };
  readonly 5?: { id: string; exercises: IExercise[] };
  readonly 6?: { id: string; exercises: IExercise[] };
}
