export interface ICompletedExercise {
  readonly _id?: string;
  readonly userId: string;
  readonly exerciseId: string;
  readonly start: number;
  readonly duration: number;
  readonly distances?: string[];
  readonly times?: number[];
  readonly setsReps?: number[];
  readonly setsWeights?: number[];
}
