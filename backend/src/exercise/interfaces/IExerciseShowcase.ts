export interface IExerciseShowcase {
  readonly _id: string;
  readonly title: string;
  readonly thumbnail: string;
  readonly type: 'gym' | 'time' | 'distance';
}
