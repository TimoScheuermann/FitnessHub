export interface IUser {
  readonly _id: string;
  readonly thirdPartyId: number | string;
  readonly provider: 'google' | 'github' | 'adobe' | 'amazon';
  readonly givenName: string;
  readonly familyName: string;
  readonly avatar: string;
  readonly date: number;
  readonly group: string;
}
export interface IUserInfo {
  readonly username: string;
  readonly avatar: string;
}

export interface ITrainingplan {
  readonly _id: string;
  readonly title: string;
  readonly author: string;
  readonly category: string;
  readonly time: number;
  readonly units: ITrainingUnit[];
}
export interface ITrainingUnit {
  readonly name: string;
  readonly repetitions: number;
  readonly sets: number;
  readonly video: string;
  readonly image: string;
  readonly affectedMuscles: string[];
}
