import { INutrition, IRecipeIngredient } from './interfaces';

export class CreateRecipeDTO {
  readonly title!: string;
  readonly time!: number;
  readonly video!: string;
  readonly image!: string;
  readonly ingredients!: IRecipeIngredient[];
  readonly nutrition!: INutrition[];
  readonly category!: string;
}
