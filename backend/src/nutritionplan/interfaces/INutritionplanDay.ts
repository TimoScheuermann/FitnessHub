import { IRecipe } from 'src/recipe/interfaces/IRecipe';

export interface INutritionplanDay {
  breakfast: IRecipe;
  lunch: IRecipe;
  dinner: IRecipe;
  snacks: IRecipe[];
}
