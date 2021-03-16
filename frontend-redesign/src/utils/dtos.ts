import { INutrition, IRecipeIngredient } from './interfaces';

export class CreateRecipeDTO {
  title!: string;
  category!: string[];
  time!: number;
  difficulty!: number;
  ingredients!: IRecipeIngredient[];
  nutrition!: INutrition[];
  thumbnail!: string;
  steps!: string[];

  source?: string;
  video?: string;
  description?: string;
}
export class FinishExerciseDTO {
  exerciseId!: string;
  start!: number;
  duration!: number;
  distances?: string[];
  times?: number[];
  setsReps?: number[];
  setsWeights?: number[];
}

export class CreateExerciseDTO {
  title!: string;
  affectedMuscles!: string[];
  thumbnail!: string;
  difficulty!: number;

  explanatoryVideo?: string;
  warnings!: string[]; // actually optional
  steps!: string[]; // actually optional
  possibleAtHome?: boolean;
  kneeFriendly?: boolean;

  time?: number;
  distance?: string;
  sets?: { min: number; max: number };
  reps?: { min: number; max: number };
}

export class CreateWorkoutDTO {
  title!: string;
  exercises!: string[];
}

export class CreateVariableDTO {
  title!: string;
  thumbnail!: string;
}

export class CreatePostDto {
  title?: string;
  thumbnail?: string;
  text!: string;

  recipeId?: string;
  exerciseId?: string;
}
export class NutritionplanDay {
  breakfast!: string | undefined;
  lunch!: string | undefined;
  dinner!: string | undefined;
  snacks?: string[] | undefined;
}

export class CreateNutritionplanDTO {
  readonly title!: string;
  readonly description!: string;
  readonly categories!: string[];

  readonly monday!: NutritionplanDay;
  readonly tuesday!: NutritionplanDay;
  readonly wednesday!: NutritionplanDay;
  readonly thursday!: NutritionplanDay;
  readonly friday!: NutritionplanDay;
  readonly saturday!: NutritionplanDay;
  readonly sunday!: NutritionplanDay;
}
