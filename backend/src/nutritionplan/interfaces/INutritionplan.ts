import { IRecipe } from 'src/recipe/interfaces/IRecipe';

export interface INutritionplanDay {
  breakfast: IRecipe;
  lunch: IRecipe;
  dinner: IRecipe;
  snacks: IRecipe[];
}

export interface INutritionplan {
  readonly _id?: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly description: string;
  readonly category: string;

  readonly monday: INutritionplanDay;
  readonly tuesday: INutritionplanDay;
  readonly wednesday: INutritionplanDay;
  readonly thursday: INutritionplanDay;
  readonly friday: INutritionplanDay;
  readonly saturday: INutritionplanDay;
  readonly sunday: INutritionplanDay;
}
