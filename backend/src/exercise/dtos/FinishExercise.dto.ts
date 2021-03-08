export class FinishExerciseDTO {
  exerciseId: string;
  start: number;
  duration: number;
  distances?: string[];
  times?: number[];
  setsReps?: number[];
  setsWeights?: number[];
}
