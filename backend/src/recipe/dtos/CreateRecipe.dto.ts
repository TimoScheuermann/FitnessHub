import { INutrition } from '../interfaces/INutrition';
import { IRecipeIngredient } from '../interfaces/IRecipeIngredient';

export class CreateRecipeDTO {
  readonly title: string;
  readonly time: number;
  readonly video: string;
  readonly ingredients: IRecipeIngredient[];
  readonly nutrition: INutrition[];
  readonly category: string[];
  readonly thumbnail: string;
  readonly difficulty: number;
  readonly steps: string[];
  readonly description: string;
}
