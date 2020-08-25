export interface IUser {
  readonly _id: string;
  readonly thirdPartyId: number;
  readonly provider: 'google' | 'github';
  readonly givenName: string;
  readonly familyName: string;
  readonly avatar: string;
  readonly date: number;
  readonly group: string;
}
export interface IUserInfo {
  username: string;
  avatar: string;
}

export interface ITrainingplan {
  _id?: string;
  readonly title: string;
  readonly author: string;
  readonly category: string;
  readonly time: number;
  readonly units: ITrainingUnit[];
}
export interface ITrainingUnit {
  name: string;
  repetitions: number;
  sets: number;
  video: string;
  image: string;
  affectedMuscles: string[];
}
