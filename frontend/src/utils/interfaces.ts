import { UpdateExerciseDTO } from './dtos';

export interface IUser {
  readonly _id: string;
  readonly thirdPartyId: string;
  readonly provider: 'google' | 'github' | 'adobe' | 'amazon';
  readonly givenName: string;
  readonly familyName: string;
  readonly avatar: string;
  readonly date: number;
  readonly group: string;
}
export interface IUserInfo {
  readonly _id: string;
  readonly username: string;
  readonly avatar: string;
}
export interface IRecipeIngredient {
  readonly name: string;
  readonly amount: string;
  readonly unit: string;
}
export interface IRecipe {
  readonly _id?: string;
  readonly author: string;
  readonly created: number;
  readonly updated: number;

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
export interface INutritionplanDay {
  readonly breakfast: IRecipe;
  readonly lunch: IRecipe;
  readonly dinner: IRecipe;
  readonly snacks: IRecipe[];
}
export interface INutritionplan {
  readonly _id?: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly description: string;
  readonly category: string;

  readonly monday: INutritionplanDay;
  readonly tuesday: INutritionplanDay;
  readonly wednesday: INutritionplanDay;
  readonly thursday: INutritionplanDay;
  readonly friday: INutritionplanDay;
  readonly saturday: INutritionplanDay;
  readonly sunday: INutritionplanDay;
}
export interface INutrition {
  readonly title: string;
  readonly amount: number;
  readonly unit: string;
}

export interface IPendingFriendship {
  _id: string;
  invitee: IUserInfo;
  target: IUserInfo;
}
export interface IGeneralStatistics {
  readonly users: number;
  readonly friendships: number;
  readonly workouts: number;
  readonly exercises: number;
}
export interface ILoginProviderStatistic {
  readonly provider: string;
  readonly amount: number;
}
export interface ITotalMessages {
  readonly friends: number;
  readonly inbox: number;
}

export interface IInbox {
  readonly _id: string;
  readonly date: number;
  readonly from: IUserInfo;
  readonly message: string;
}

export enum HealthType {
  WEIGHT = 'weight',
  WATER = 'water',
  HEIGHT = 'height'
}

export interface IHealth {
  readonly _id?: string;
  readonly type: HealthType;
  readonly date: number;
  readonly value: number;
  readonly user: string;
}
export interface IMessage {
  readonly _id: string;
  readonly type: string;
  readonly date: number;
  readonly from: string;
  readonly to: string;
  read: boolean;
  readonly content: string;
}

export interface IFHNotification {
  readonly img?: string;
  readonly title: string;
  readonly text: string;
  readonly to?: object;
}

export interface IExercise {
  readonly _id: string;
  readonly author: string;
  readonly reviewed: boolean;
  readonly reviewedBy: string;
  readonly created: number;
  readonly updated: number;
  readonly editedData?: UpdateExerciseDTO;

  readonly title: string;
  readonly affectedMuscles: string[];
  readonly thumbnail: string;
  readonly explanatoryVideo?: string;

  readonly difficulty: number;
  readonly warnings: string[];
  readonly steps: string[];

  // Variable, depending on exercise
  readonly time?: number;
  readonly distance?: string;
  readonly sets?: string;
  readonly reps?: string;
}

export interface IWorkout {
  readonly _id?: string;
  readonly author: string;
  readonly title: string;
  readonly exercises: IExerciseInfo[];
}
export interface IExerciseInfo {
  readonly _id?: string;
  readonly title: string;
  readonly thumbnail: string;
}
export interface ISet {
  readonly reps: number;
  readonly weight: number;
}

export interface ICompletedExercise {
  readonly _id?: string;
  readonly exercise: string;
  readonly author: string;
  readonly start: number;
  readonly end: number;

  readonly sets?: ISet[];
  readonly distance?: string;
}
