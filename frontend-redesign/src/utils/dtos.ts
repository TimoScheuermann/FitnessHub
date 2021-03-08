import { INutrition, INutritionplanDay, IRecipeIngredient } from './interfaces';

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

export class CreateNutritionplanDTO {
  readonly title!: string;
  readonly time!: number;
  readonly description!: string;
  readonly category!: string;

  readonly monday!: INutritionplanDay;
  readonly tuesday!: INutritionplanDay;
  readonly wednesday!: INutritionplanDay;
  readonly thursday!: INutritionplanDay;
  readonly friday!: INutritionplanDay;
  readonly saturday!: INutritionplanDay;
  readonly sunday!: INutritionplanDay;
}
export class UpdateNutritionplanDTO {
  readonly title?: string;
  readonly time?: number;
  readonly description?: string;
  readonly category?: string;

  readonly monday?: INutritionplanDay;
  readonly tuesday?: INutritionplanDay;
  readonly wednesday?: INutritionplanDay;
  readonly thursday?: INutritionplanDay;
  readonly friday?: INutritionplanDay;
  readonly saturday?: INutritionplanDay;
  readonly sunday?: INutritionplanDay;
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
