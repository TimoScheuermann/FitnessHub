export interface IExercise {
  readonly _id?: string;
  readonly reviewed: boolean;
  readonly reviewedBy: string;
  readonly created: number;
  readonly updated: number;

  readonly title: string;
  readonly description: string;
  readonly affectedMuscles: string;
  readonly thumbnail: string;
  readonly explanatoryVideo: string;

  readonly time: number;
  readonly difficulty: number;
  readonly steps: string[];
  readonly sets: number;
  readonly reps: number;
}
