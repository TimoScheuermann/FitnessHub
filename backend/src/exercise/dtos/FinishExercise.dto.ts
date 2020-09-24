export class FinishExerciseDTO {
  readonly exercise: string;
  readonly start: number;
  readonly duration: number;
  readonly distances?: number[];
  readonly times?: number[];
  readonly setsReps?: number[];
  readonly setsWeights?: number[];
}
