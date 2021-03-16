import { IRecipe } from 'src/recipe/interfaces/IRecipe';

export class INutritionplanDayFull {
  breakfast: IRecipe;
  lunch: IRecipe;
  dinner: IRecipe;
  snacks?: IRecipe[];
}
