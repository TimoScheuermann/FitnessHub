export interface ISet {
  readonly reps: number;
  readonly weight: number;
}

export interface ICompletedExercise {
  readonly _id?: string;
  readonly exercise: string;
  readonly user: string;
  readonly start: number;
  readonly end: number;

  readonly sets?: ISet[];
  readonly distance?: string;
}
