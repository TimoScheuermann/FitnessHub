export interface IUserInfo {
  _id: string;
  username: string;
  avatar: string;
  readonly suspended?: number;
  readonly suspendedBy?: string;
}
