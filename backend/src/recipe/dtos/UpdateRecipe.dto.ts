import { INutrition } from '../interfaces/INutrition';
import { IRecipeIngredient } from '../interfaces/IRecipeIngredient';

export class UpdateRecipeDTO {
  readonly title?: string;
  readonly category?: string[];
  readonly time?: number;
  readonly difficulty?: number;
  readonly ingredients?: IRecipeIngredient[];
  readonly nutrition?: INutrition[];
  readonly thumbnail?: string;
  readonly steps?: string[];

  readonly video?: string;
  readonly description?: string;
}