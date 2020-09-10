import { INutrition } from './INutrition';
import { IRecipeIngredient } from './IRecipeIngredient';
export interface IRecipe {
  readonly _id?: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly video?: string;
  readonly thumbnail: string;
  readonly ingredients: IRecipeIngredient[];
  readonly nutrition: INutrition[];
  readonly category: string[];
  readonly difficulty: number;
  readonly steps: string[];
  readonly description: string;
}
