import { Provider } from 'src/auth/auth.service';

export interface IUser {
  readonly _id?: string;
  readonly thirdPartyId: string;
  readonly provider?: Provider;
  readonly givenName: string;
  readonly familyName: string;
  readonly avatar: string;
  readonly date?: number;
  readonly group?: string;
  readonly suspended?: number;
  readonly suspendedBy?: string;
}
