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
  _id?: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly video: string;
  readonly image: string;
  readonly ingredients: IRecipeIngredient[];
  readonly nutrition: INutrition[];
  readonly category: string;
}
export interface INutritionplan {
  _id: string;
  readonly title: string;
  readonly author: string;
  readonly time: number;
  readonly description: string;
  readonly recipes: IRecipe[];
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
