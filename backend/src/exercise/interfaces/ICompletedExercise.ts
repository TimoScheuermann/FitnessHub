export interface ISet {
  readonly reps: number;
  readonly weight: number;
}

export interface ICompletedExercise {
  readonly _id?: string;
  readonly exercise: string;
  readonly author: string;
  readonly date: number;
  readonly time: number;

  readonly sets?: ISet[];
  readonly distance?: number;
}
