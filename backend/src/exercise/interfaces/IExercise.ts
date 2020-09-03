export interface IExercise {
  readonly _id?: string;
  readonly reviewed: boolean;
  readonly reviewedBy: string;
  readonly created: number;
  readonly updated: number;

  readonly title: string;
  readonly affectedMuscles: string[];
  readonly category: string[];
  readonly thumbnail: string;
  readonly explanatoryVideo?: string; // v

  readonly difficulty: number;
  readonly warnings: string[];
  readonly steps: string[];

  readonly time?: number;
  readonly distance?: number;

  readonly sets?: string; // v
  readonly reps?: string; // v
}
