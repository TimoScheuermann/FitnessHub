import { HealthType } from '../health.service';

export interface IHealth {
  readonly _id?: string;
  readonly type: HealthType;
  readonly date: number;
  readonly value: number;
  readonly user: string;
}
