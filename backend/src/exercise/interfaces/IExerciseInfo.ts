export interface IExerciseInfo {
  readonly _id?: string;
  readonly title: string;
  readonly thumbnail: string;
  readonly difficulty: number;
  readonly type: 'gym' | 'time' | 'distance';
  readonly affectedMuscles: string[];
}
