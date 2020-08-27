import { IRecipe } from 'src/recipe/interfaces/IRecipe';

export interface INutritionplan {
  _id: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly recipes: IRecipe[];
}
