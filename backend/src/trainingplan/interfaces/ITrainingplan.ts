import { ITrainingUnit } from './ITrainingUnit';

export interface ITrainingplan {
  _id?: string;
  readonly title: string;
  readonly author: string;
  readonly category: string;
  readonly time: number;
  readonly units: ITrainingUnit[];
}
