import { INutritionplanDay } from '../interfaces/INutritionplanDay';

export class CreateNutritionplanDTO {
  readonly title: string;
  readonly description: string;
  readonly categories: string[];

  readonly monday: INutritionplanDay;
  readonly tuesday: INutritionplanDay;
  readonly wednesday: INutritionplanDay;
  readonly thursday: INutritionplanDay;
  readonly friday: INutritionplanDay;
  readonly saturday: INutritionplanDay;
  readonly sunday: INutritionplanDay;
}
