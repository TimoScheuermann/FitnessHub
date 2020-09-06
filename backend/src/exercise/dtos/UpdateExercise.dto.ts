export class UpdateExerciseDTO {
  readonly title?: string;
  readonly affectedMuscles?: string[];
  readonly thumbnail?: string;
  readonly explanatoryVideo?: string;

  readonly difficulty?: number;
  readonly warnings?: string[];
  readonly steps?: string[];

  // Variable, depending on exercise
  readonly time?: number;
  readonly distance?: string;
  readonly sets?: string;
  readonly reps?: string;
}
