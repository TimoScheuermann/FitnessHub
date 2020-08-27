import { IRecipeIngredient } from './IRecipeIngredient';

export interface IRecipe {
  _id?: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly video: string;
  readonly image: string;
  readonly ingredients: IRecipeIngredient[];
  readonly calories: number;
}
