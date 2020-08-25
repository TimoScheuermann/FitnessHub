export interface IUser {
  readonly _id: string;
  readonly thirdPartyId: number;
  readonly provider: 'google' | 'github';
  readonly givenName: string;
  readonly familyName: string;
  readonly avatar: string;
  readonly date: number;
  readonly group: string;
  readonly plans: string[];
}
