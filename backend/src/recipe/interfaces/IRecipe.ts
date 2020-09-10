import { UpdateRecipeDTO } from '../dtos/UpdateRecipe.dto';
import { INutrition } from './INutrition';
import { IRecipeIngredient } from './IRecipeIngredient';
export interface IRecipe {
  readonly _id?: string;
  readonly author: string;
  readonly created: number;
  readonly updated: number;
  readonly editedData?: UpdateRecipeDTO;

  readonly title: string;
  readonly category: string[];
  readonly time: number;
  readonly difficulty: number;
  readonly ingredients: IRecipeIngredient[];
  readonly nutrition: INutrition[];
  readonly thumbnail: string;
  readonly steps: string[];

  readonly video?: string;
  readonly description?: string;
}
