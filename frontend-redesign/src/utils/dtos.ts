import { INutrition, INutritionplanDay, IRecipeIngredient } from './interfaces';

export class CreateRecipeDTO {
  readonly title!: string;
  readonly category!: string[];
  readonly time!: number;
  readonly difficulty!: number;
  readonly ingredients!: IRecipeIngredient[];
  readonly nutrition!: INutrition[];
  readonly thumbnail!: string;
  readonly steps!: string[];

  readonly source?: string;
  readonly video?: string;
  readonly description?: string;
}
export class UpdateRecipeDTO {
  readonly title?: string;
  readonly category?: string[];
  readonly time?: number;
  readonly difficulty?: number;
  readonly ingredients?: IRecipeIngredient[];
  readonly nutrition?: INutrition[];
  readonly thumbnail?: string;
  readonly steps?: string[];

  readonly source?: string;
  readonly video?: string;
  readonly description?: string;
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
  readonly exercise!: string;
  readonly start!: number;
  readonly duration!: number;
  distances?: number[];
  times?: number[];
  setsReps?: number[];
  setsWeights?: number[];
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
  _id?: string;
  author?: string;
  reviewed?: boolean;
  reviewedBy?: string;
  created?: number;
  updated?: number;
  editedData?: UpdateExerciseDTO;

  title!: string;
  affectedMuscles!: string[];
  thumbnail!: string;
  explanatoryVideo?: string;

  difficulty!: number;
  warnings!: string[];
  steps!: string[];
  possibleAtHome!: boolean;

  // Variable, depending on exercise
  time?: number;
  distance?: string;
  sets?: string;
  reps?: string;
}
export class CreateWorkoutDTO {
  title!: string;
  exercises!: string[];
}

export class CreateVariableDTO {
  title!: string;
  thumbnail!: string;
}
