import { INutritionplanDayFull } from './INutritionplanDayFull';

export interface INutritionplanFull {
  readonly _id?: string;
  readonly author: string;
  readonly created: number;
  readonly updated: number;

  readonly title: string;
  readonly description: string;
  readonly categories: string[];

  readonly monday: INutritionplanDayFull;
  readonly tuesday: INutritionplanDayFull;
  readonly wednesday: INutritionplanDayFull;
  readonly thursday: INutritionplanDayFull;
  readonly friday: INutritionplanDayFull;
  readonly saturday: INutritionplanDayFull;
  readonly sunday: INutritionplanDayFull;
}
