export class CreateExerciseDTO {
  readonly title: string;
  readonly affectedMuscles: string[];
  readonly thumbnail: string;
  readonly explanatoryVideo?: string;

  readonly difficulty: number;
  warnings?: string[];
  steps?: string[];
  readonly possibleAtHome?: boolean;
  readonly kneeFriendly?: boolean;

  // Variable, depending on exercise
  time?: number;
  distance?: string;
  sets?: { min: number; max: number };
  reps?: { min: number; max: number };
}
