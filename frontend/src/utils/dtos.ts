import { INutrition, IRecipeIngredient } from './interfaces';

export class CreateRecipeDTO {
  readonly title!: string;
  readonly time!: number;
  readonly video!: string;
  readonly thumbnail!: string;
  readonly ingredients!: IRecipeIngredient[];
  readonly nutrition!: INutrition[];
  readonly category!: string;
}
export class UpdateExerciseDTO {
  readonly title?: string;
  readonly affectedMuscles?: string[];
  readonly thumbnail?: string;
  readonly explanatoryVideo?: string;

  readonly difficulty?: number;
  readonly warnings?: string[];
  readonly steps?: string[];

  // Variable, depending on exercise
  readonly time?: number;
  readonly distance?: string;
  readonly sets?: string;
  readonly reps?: string;
}
export class CreateExerciseDTO {
  title!: string;
  affectedMuscles!: string[];
  thumbnail!: string;
  explanatoryVideo?: string;

  difficulty!: number;
  warnings!: string[];
  steps!: string[];

  // Variable, depending on exercise
  time?: number;
  distance?: string;
  sets?: string;
  reps?: string;
}
