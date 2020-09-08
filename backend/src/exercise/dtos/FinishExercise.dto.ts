import { ISet } from '../interfaces/ICompletedExercise';

export class FinishExerciseDTO {
  readonly exercise: string;
  readonly start: number;
  readonly end: number;
  readonly distance?: string;
  readonly sets?: ISet[];
}
